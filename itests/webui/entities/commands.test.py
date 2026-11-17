"""Tests about the menu of commands that `x` opens (ADR 0021): every action of
the focused column, drawn from the buttons and menus the column already has,
each with a letter to type.
"""

import re

import pytest
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.tags.tag_create import (
    sync_detailed as tag_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.tag_create_args import TagCreateArgs
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Locator, Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_PHONE: ViewportSize = {"width": 390, "height": 844}
_TRUNK = "/app/workspace/apps/habits/habits"
_MENU = "[data-strata-commands-menu]"
_FOOTER = "#strata-footer"


@pytest.fixture(autouse=True, scope="module")
def _habits_on(logged_in_client: AuthenticatedClient) -> None:
    workspace_set_feature_sync(
        client=logged_in_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
    )
    return


@pytest.fixture(scope="module")
def habit(logged_in_client: AuthenticatedClient) -> Habit:
    result = habit_create_sync(
        client=logged_in_client,
        body=HabitCreateArgs(
            name="Commands habit",
            period=RecurringTaskPeriod.DAILY,
            is_key=False,
            eisen=Eisen.REGULAR,
            difficulty=Difficulty.MEDIUM,
        ),
    )
    return get_parsed_from_response(HabitCreateResult, result).new_habit


@pytest.fixture(autouse=True, scope="module")
def _tags(logged_in_client: AuthenticatedClient) -> None:
    """Two tags, so that the list of habits has a filter of tags to choose in."""
    for name in ("Commands alpha", "Commands beta"):
        tag_create_sync(client=logged_in_client, body=TagCreateArgs(name=name))


def _open(page: Page, path: str) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(path)
    wait_for_hydration(page)
    page.locator("body").click(position={"x": 5, "y": 5})


def _command(page: Page, label: str) -> Locator:
    return page.locator(f"{_MENU} [data-strata-command='{label}']")


def _type_label_of(page: Page, label: str) -> None:
    """Type the letters the menu shows next to a command."""
    letters = _command(page, label).locator("[data-strata-command-label]")
    page.keyboard.type(letters.get_attribute("data-strata-command-label") or "")


def _type_label_of_first(page: Page, label: str) -> None:
    """Type the letters of the first command with this label."""
    letters = _command(page, label).first.locator("[data-strata-command-label]")
    page.keyboard.type(letters.get_attribute("data-strata-command-label") or "")


def test_x_opens_the_menu_and_escape_closes_it(page: Page) -> None:
    _open(page, _TRUNK)

    page.keyboard.press("x")
    expect(page.locator(_MENU)).to_be_visible()

    page.keyboard.press("Escape")
    expect(page.locator(_MENU)).to_have_count(0)


def test_it_lists_the_main_action_of_the_column(page: Page) -> None:
    _open(page, _TRUNK)

    page.keyboard.press("x")

    expect(_command(page, "New")).to_be_visible()


def test_typing_the_letters_of_the_main_action_runs_it(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")

    _type_label_of(page, "New")

    page.wait_for_url("**/habits/new**")
    expect(page.locator(_MENU)).to_have_count(0)


def _choices(page: Page, filter_title: str) -> Locator:
    return page.locator(f"{_MENU} [data-strata-commands-choices='{filter_title}']")


def test_a_filter_is_one_item_that_says_what_it_has_chosen(page: Page) -> None:
    _open(page, _TRUNK)

    page.keyboard.press("x")

    grouping = _command(page, "Grouping")
    expect(grouping).to_have_count(1)
    expect(grouping).to_have_attribute("data-strata-command-opens", "true")
    expect(grouping.locator("[data-strata-command-detail]")).not_to_be_empty()
    # Its choices are not in the list.
    expect(_command(page, "Flat")).to_have_count(0)


def test_typing_the_letters_of_a_filter_opens_its_choices_beside_the_list(
    page: Page,
) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")

    _type_label_of(page, "Grouping")

    expect(_choices(page, "Grouping")).to_be_visible()
    expect(
        _choices(page, "Grouping").locator("[data-strata-command]")
    ).not_to_have_count(0)
    # The list is still there.
    expect(_command(page, "New")).to_be_visible()


def test_a_choice_of_a_filter_is_set_with_its_own_letters(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Grouping")

    letters = (
        _choices(page, "Grouping")
        .locator("[data-strata-command='By Aspect']")
        .locator("[data-strata-command-label]")
    )
    page.keyboard.type(letters.get_attribute("data-strata-command-label") or "")

    page.wait_for_url(re.compile(r"grouping.*by-aspect"))
    expect(page.locator(_MENU)).to_have_count(0)


def test_backspace_on_an_empty_label_closes_the_choices(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Grouping")
    expect(_choices(page, "Grouping")).to_be_visible()

    page.keyboard.press("Backspace")

    expect(_choices(page, "Grouping")).to_have_count(0)
    expect(page.locator(_MENU)).to_be_visible()


def test_it_lists_the_entries_of_the_menu_of_the_column(
    page: Page, habit: Habit
) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")

    page.keyboard.press("x")

    expect(_command(page, "Archive…")).to_be_visible()


def test_the_menu_entries_are_in_a_column_of_their_own_at_the_right(
    page: Page, habit: Habit
) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")

    page.keyboard.press("x")

    menu = page.locator(f"{_MENU} [data-strata-commands-menu-group]")
    expect(menu).to_have_count(1)
    expect(menu.locator("[data-strata-command='Archive…']")).to_be_visible()
    # The actions of the column and its sections are not in it.
    expect(menu.locator("[data-strata-command='New']")).to_have_count(0)
    others = page.locator(
        f"{_MENU} [data-strata-commands-group]:not([data-strata-commands-menu-group])"
    )
    menu_box = menu.bounding_box()
    assert menu_box is not None
    for other in others.all():
        box = other.bounding_box()
        assert box is not None
        assert box["x"] + box["width"] <= menu_box["x"] + 1


def test_typing_the_letters_of_a_menu_entry_runs_it(page: Page, habit: Habit) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")
    page.keyboard.press("x")

    _type_label_of(page, "Archive…")

    expect(page.locator(_MENU)).to_have_count(0)
    expect(page.locator("#leaf-entity-archive-confirm")).to_be_visible()


def test_it_groups_the_commands_by_the_section_they_are_in(
    page: Page, habit: Habit
) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")

    page.keyboard.press("x")

    groups = page.locator(f"{_MENU} [data-strata-commands-group]")
    # The column's own commands, and those of the sections that have some.
    assert groups.count() >= 1
    for group in groups.all():
        expect(group.locator("[data-strata-command]").first).to_be_visible()


def test_clicking_a_command_runs_it(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")

    _command(page, "New").click()

    page.wait_for_url("**/habits/new**")


def test_a_key_that_is_no_label_is_held_back(page: Page) -> None:
    _open(page, _TRUNK)
    url = page.url
    page.keyboard.press("x")
    typed = page.locator("[data-strata-commands-typed]")
    expect(typed).to_have_text("type a label")

    page.keyboard.press("1")
    page.keyboard.press("Backspace")

    expect(page.locator(_MENU)).to_be_visible()
    expect(typed).to_have_text("type a label")
    assert page.url == url


def test_the_footer_says_how_to_use_it(page: Page) -> None:
    _open(page, _TRUNK)
    expect(
        page.locator(f"{_FOOTER} [data-strata-footer-key='commands'] kbd")
    ).to_have_text(["x"])

    page.keyboard.press("x")

    expect(page.locator(f"{_FOOTER} [data-strata-footer-key]").first).to_have_text(
        "type a label to run it"
    )


def test_x_in_a_field_does_not_open_it(page: Page) -> None:
    _open(page, "/app/workspace/account")

    page.locator("input[name='name']").click()
    page.keyboard.type("x")

    expect(page.locator(_MENU)).to_have_count(0)


def test_it_is_off_on_a_phone(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(_TRUNK)
    wait_for_hydration(page)
    page.locator("body").click(position={"x": 5, "y": 5})

    page.keyboard.press("x")

    expect(page.locator(_MENU)).to_have_count(0)


def test_a_key_of_the_menu_does_not_start_hints(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")

    # `s` is the key of hint mode, and may be a letter of the menu: it has it.
    page.keyboard.press("s")

    expect(page.locator("[data-strata-hints]")).to_have_count(0)


def test_the_choices_of_tags_are_searched_and_turned_on_with_enter(
    page: Page,
) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Tags")
    panel = _choices(page, "Tags")
    expect(panel.locator("[data-strata-commands-query]")).to_be_visible()
    # Letters are no labels here: they are the search.
    expect(panel.locator("[data-strata-command-label]")).to_have_count(0)

    page.keyboard.type("alp")

    expect(panel.locator("[data-strata-command]")).to_have_count(1)
    expect(panel.locator("[data-strata-command='Commands alpha']")).to_be_visible()

    page.keyboard.press("Enter")

    page.wait_for_url(re.compile(r"tags"))
    # The panel stays, the search is cleared, and the choice shows as on.
    expect(page.locator(_MENU)).to_be_visible()
    expect(
        panel.locator("[data-strata-command='Commands alpha'][data-strata-command-on]")
    ).to_be_visible()
    expect(panel.locator("[data-strata-command='Commands beta']")).to_be_visible()


def test_the_arrows_move_along_the_found_choices(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Tags")
    page.keyboard.type("commands")
    panel = _choices(page, "Tags")
    expect(panel.locator("[data-strata-command-cursor]")).to_have_attribute(
        "data-strata-command", "Commands alpha"
    )

    page.keyboard.press("ArrowDown")

    expect(panel.locator("[data-strata-command-cursor]")).to_have_attribute(
        "data-strata-command", "Commands beta"
    )


def test_the_footer_says_how_to_search_the_choices(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Tags")

    expect(page.locator(f"{_FOOTER} [data-strata-footer-key]").first).to_have_text(
        "type to search"
    )


def test_escape_in_the_choices_goes_back_to_the_list_and_then_leaves(
    page: Page,
) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Tags")
    page.keyboard.type("alp")
    expect(_choices(page, "Tags")).to_be_visible()

    page.keyboard.press("Escape")

    expect(_choices(page, "Tags")).to_have_count(0)
    expect(page.locator(_MENU)).to_be_visible()
    expect(_command(page, "Tags")).to_be_visible()

    page.keyboard.press("Escape")

    expect(page.locator(_MENU)).to_have_count(0)


def test_escape_in_the_choices_of_a_few_goes_back_to_the_list(page: Page) -> None:
    _open(page, _TRUNK)
    page.keyboard.press("x")
    _type_label_of(page, "Grouping")
    expect(_choices(page, "Grouping")).to_be_visible()

    page.keyboard.press("Escape")

    expect(_choices(page, "Grouping")).to_have_count(0)
    expect(page.locator(_MENU)).to_be_visible()


def test_a_section_lists_how_it_is_laid_out_as_its_last_commands(
    page: Page, habit: Habit
) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")

    page.keyboard.press("x")

    groups = page.locator(
        f"{_MENU} [data-strata-commands-group]:not([data-strata-commands-menu-group])"
    )
    laid_out = 0
    for group in groups.all():
        last = group.locator("[data-strata-command]").last.get_attribute(
            "data-strata-command"
        )
        if last in ("Collapse", "Expand", "Split out", "Fold back"):
            laid_out += 1
    assert laid_out >= 1


def test_collapse_in_the_menu_collapses_the_section(page: Page, habit: Habit) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")
    page.keyboard.press("x")
    collapse = _command(page, "Collapse").first
    section = collapse.locator("xpath=ancestor::*[@data-strata-commands-group][1]")
    title = section.get_attribute("data-strata-commands-group") or ""

    _type_label_of_first(page, "Collapse")

    expect(page.locator(_MENU)).to_have_count(0)
    expect(
        page.locator(f"[data-strata-section-title='{title}'] [aria-expanded='false']")
    ).to_have_count(1)

    # A collapsed section has nothing but its layout to offer: it can be expanded.
    page.keyboard.press("x")
    expect(
        page.locator(
            f"{_MENU} [data-strata-commands-group='{title}'] [data-strata-command='Expand']"
        )
    ).to_be_visible()


def test_split_out_and_fold_back_are_in_the_menu(page: Page, habit: Habit) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")
    page.keyboard.press("x")
    split = _command(page, "Split out").first
    title = (
        split.locator(
            "xpath=ancestor::*[@data-strata-commands-group][1]"
        ).get_attribute("data-strata-commands-group")
        or ""
    )

    _type_label_of_first(page, "Split out")

    expect(
        page.locator(
            f"[data-strata-section-split='column'][data-strata-section-title='{title}']"
        )
    ).to_be_visible()
    page.keyboard.press("x")
    fold = page.locator(
        f"{_MENU} [data-strata-commands-group='{title}'] [data-strata-command='Fold back']"
    )
    expect(fold).to_be_visible()
    _type_label_of_first(page, "Fold back")
    expect(page.locator("[data-strata-section-split='column']")).to_have_count(0)


def test_it_lists_the_way_along_the_collection_of_an_open_item(
    page: Page, habit: Habit
) -> None:
    # Reached from the list, so it has a place in it.
    _open(page, _TRUNK)
    page.locator(f"a[href*='{habit.ref_id}']").first.click()
    expect(page.locator("[data-strata-position]")).to_be_visible()

    page.keyboard.press("x")

    expect(_command(page, "Previous item")).to_be_visible()
    expect(_command(page, "Next item")).to_be_visible()


def test_o_and_p_go_to_the_previous_and_the_next_item(page: Page, habit: Habit) -> None:
    _open(page, _TRUNK)
    page.locator(f"a[href*='{habit.ref_id}']").first.click()
    expect(page.locator("[data-strata-position]")).to_be_visible()
    if not page.locator("[data-strata-position-next]").is_enabled():
        pytest.skip("nothing after it to go to")
    here = page.url.split("?")[0]

    page.keyboard.press("p")
    expect(page).not_to_have_url(re.compile(re.escape(here) + r"(\?.*)?$"))

    page.keyboard.press("o")
    expect(page).to_have_url(re.compile(re.escape(here) + r"(\?.*)?$"))


def test_the_menu_column_has_the_way_along_first_then_rules(
    page: Page, habit: Habit
) -> None:
    _open(page, _TRUNK)
    page.locator(f"a[href*='{habit.ref_id}']").first.click()
    expect(page.locator("[data-strata-position]")).to_be_visible()

    page.keyboard.press("x")

    menu = page.locator(f"{_MENU} [data-strata-commands-menu-group]")
    labels = [
        command.get_attribute("data-strata-command")
        for command in menu.locator("[data-strata-command]").all()
    ]
    assert labels[:2] == ["Previous item", "Next item"]
    assert labels.index("History") == 2
    assert labels.index("Archive…") > labels.index("Access")
    # A rule after the way along, and one before what destroys.
    expect(menu.locator("[data-strata-command-rule]")).to_have_count(2)


def test_the_layout_of_a_section_is_set_apart_by_a_rule(
    page: Page, habit: Habit
) -> None:
    _open(page, f"{_TRUNK}/{habit.ref_id}")

    page.keyboard.press("x")

    group = (
        page.locator(
            f"{_MENU} [data-strata-commands-group]:not([data-strata-commands-menu-group])"
        )
        .filter(has=page.locator("[data-strata-command='Collapse']"))
        .first
    )
    # A rule comes just before the first layout command of the section.
    rule = group.locator(
        "[data-strata-command-rule] + [data-strata-command='Collapse'], "
        "[data-strata-command-rule] + [data-strata-command='Expand'], "
        "[data-strata-command-rule] + [data-strata-command='Split out']"
    )
    assert group.locator("[data-strata-command-rule]").count() <= 1
    if group.locator("[data-strata-command]").count() > 1:
        expect(rule).to_have_count(1)

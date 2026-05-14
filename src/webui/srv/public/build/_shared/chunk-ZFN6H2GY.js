import {
  midDate
} from "/build/_shared/chunk-WCBSHJX3.js";
import {
  dateToAdate
} from "/build/_shared/chunk-72ELS2LF.js";

// ../core/jupiter/core/life_plan/sub/chapters/root.ts
function sortChaptersNaturally(birthday, today, chapters, milestones, sortedAspects) {
  return [...chapters].sort((a, b) => {
    const aspectA = sortedAspects.find(
      (aspect) => aspect.ref_id === a.aspect_ref_id
    );
    const aspectB = sortedAspects.find(
      (aspect) => aspect.ref_id === b.aspect_ref_id
    );
    if (aspectA && aspectB) {
      return aspectA.name.localeCompare(aspectB.name);
    }
    return midDate(a.start_date, birthday, today, milestones).toMillis() - midDate(b.start_date, birthday, today, milestones).toMillis();
  });
}
function resolveChapterForSuggestions(chapter, birthday, today, milestones) {
  return {
    name: chapter.name,
    start_date: dateToAdate(
      midDate(chapter.start_date, birthday, today, milestones)
    ),
    end_date: dateToAdate(
      midDate(chapter.end_date, birthday, today, milestones)
    )
  };
}
function resolveChaptersForSuggestions(chapters, birthday, today, milestones) {
  const resolved = [];
  for (const chapter of chapters) {
    try {
      resolved.push(
        resolveChapterForSuggestions(chapter, birthday, today, milestones)
      );
    } catch {
    }
  }
  return resolved;
}
function findActiveChaptersForSuggestions(chapters, birthday, today, milestones) {
  const todayIso = today.toISODate();
  if (!todayIso) {
    return [];
  }
  return resolveChaptersForSuggestions(
    chapters,
    birthday,
    today,
    milestones
  ).filter(
    (chapter) => chapter.start_date <= todayIso && todayIso <= chapter.end_date
  );
}

export {
  sortChaptersNaturally,
  findActiveChaptersForSuggestions
};
//# sourceMappingURL=/build/_shared/chunk-ZFN6H2GY.js.map

"""Tests for common errors."""

from collections.abc import Mapping

import pytest
from jupiter.framework_new.errors import InputValidationError, MultiInputValidationError


def test_input_validation_error_inherits_from_value_error():
    """Test that InputValidationError inherits from ValueError."""
    error = InputValidationError("test message")
    assert isinstance(error, ValueError)
    assert str(error) == "test message"


def test_input_validation_error_can_be_raised_and_caught():
    """Test that InputValidationError can be raised and caught."""
    with pytest.raises(InputValidationError) as exc_info:
        raise InputValidationError("validation failed")

    assert str(exc_info.value) == "validation failed"


def test_input_validation_error_can_be_caught_as_value_error():
    """Test that InputValidationError can be caught as ValueError."""
    with pytest.raises(ValueError) as exc_info:  # noqa: PT011
        raise InputValidationError("validation failed")

    assert isinstance(exc_info.value, InputValidationError)
    assert str(exc_info.value) == "validation failed"


def test_input_validation_error_accepts_no_message():
    """Test that InputValidationError can be created without a message."""
    error = InputValidationError()
    assert isinstance(error, ValueError)
    assert str(error) == ""


def test_input_validation_error_accepts_custom_message():
    """Test that InputValidationError accepts custom messages."""
    message = "Custom validation error message"
    error = InputValidationError(message)
    assert str(error) == message


def test_multi_input_validation_error_inherits_from_value_error():
    """Test that MultiInputValidationError inherits from ValueError."""
    errors = {"field1": InputValidationError("error1")}
    multi_error = MultiInputValidationError(errors)
    assert isinstance(multi_error, ValueError)


def test_multi_input_validation_error_errors_property_returns_mapping():
    """Test that errors property returns a Mapping."""
    error1 = InputValidationError("first error")
    error2 = InputValidationError("second error")
    errors = {"field1": error1, "field2": error2}

    multi_error = MultiInputValidationError(errors)
    errors_mapping = multi_error.errors

    assert isinstance(errors_mapping, Mapping)
    assert errors_mapping["field1"] == error1
    assert errors_mapping["field2"] == error2


def test_multi_input_validation_error_can_be_raised_and_caught():
    """Test that MultiInputValidationError can be raised and caught."""
    errors = {"field1": InputValidationError("error1")}

    with pytest.raises(MultiInputValidationError) as exc_info:
        raise MultiInputValidationError(errors)

    assert exc_info.value._errors == errors


def test_multi_input_validation_error_can_be_caught_as_value_error():
    """Test that MultiInputValidationError can be caught as ValueError."""
    errors = {"field1": InputValidationError("error1")}

    with pytest.raises(ValueError) as exc_info:  # noqa: PT011
        raise MultiInputValidationError(errors)

    assert isinstance(exc_info.value, MultiInputValidationError)
    assert exc_info.value._errors == errors


def test_multi_input_validation_error_empty_errors_dict():
    """Test MultiInputValidationError with empty errors dict."""
    errors = {}
    multi_error = MultiInputValidationError(errors)

    assert multi_error._errors == {}
    assert len(multi_error.errors) == 0


def test_multi_input_validation_error_single_error():
    """Test MultiInputValidationError with single error."""
    error = InputValidationError("single error")
    errors = {"field1": error}
    multi_error = MultiInputValidationError(errors)

    assert len(multi_error.errors) == 1
    assert multi_error.errors["field1"] == error

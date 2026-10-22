import pytest
from app.runtime import calculate


@pytest.mark.parametrize("expression", ["1e309", "1e308", "9e999", "2**30", "1/0", "float('inf')"])
def test_unsafe_math_rejected(expression):
    with pytest.raises((ValueError, ZeroDivisionError, SyntaxError, OverflowError)):
        calculate(expression)


def test_expression_must_be_text():
    with pytest.raises(ValueError):
        calculate(None)


def test_normal_calculation():
    assert calculate("(2 + 3) * 4") == 20

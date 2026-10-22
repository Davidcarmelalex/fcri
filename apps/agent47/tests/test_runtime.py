import pytest
from app.runtime import calculate


@pytest.mark.parametrize("expr,expected", [("2+3*4",14),("(20-8)/3",4),("1.5+2.5",4)])
def test_calculator(expr, expected):
    assert calculate(expr) == expected


@pytest.mark.parametrize("expr", ["__import__('os').system('id')","2**1000","[1,2]","9999999999999999999","1/0"])
def test_calculator_rejects(expr):
    with pytest.raises((ValueError, ZeroDivisionError)):
        calculate(expr)

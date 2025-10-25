"""A thing is some data carrying domain or generic object."""

from jupiter.framework.concept import Concept
from jupiter.framework.primitive import Primitive
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase

Thing = Concept | Primitive | UseCaseArgsBase | UseCaseResultBase

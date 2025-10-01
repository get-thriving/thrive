"""A thing is some data carrying domain or generic object."""

from jupiter.framework_new.concept import Concept
from jupiter.framework_new.primitive import Primitive
from jupiter.framework_new.use_case_io import UseCaseArgsBase, UseCaseResultBase

Thing = Concept | Primitive | UseCaseArgsBase | UseCaseResultBase

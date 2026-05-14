import {
  useSearchParams
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/time_events/component/params-source.tsx
var import_react2 = __toESM(require_react(), 1);
function TimeEventParamsSource(props) {
  const [searchParams, setSearchParms] = useSearchParams();
  (0, import_react2.useEffect)(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("sourceStartDate", props.startDate.toString());
    newSearchParams.set(
      "sourceStartTimeInDay",
      props.startTimeInDay.toString()
    );
    newSearchParams.set("sourceDurationMins", props.durationMins.toString());
    setSearchParms(newSearchParams, {
      replace: true
    });
  }, [
    searchParams,
    setSearchParms,
    props.startDate,
    props.startTimeInDay,
    props.durationMins
  ]);
  (0, import_react2.useEffect)(() => {
    return () => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("sourceStartDate");
      newSearchParams.delete("sourceStartTimeInDay");
      newSearchParams.delete("sourceDurationMins");
      setSearchParms(newSearchParams, {
        replace: true
      });
    };
  }, [searchParams, setSearchParms]);
  return null;
}

export {
  TimeEventParamsSource
};
//# sourceMappingURL=/build/_shared/chunk-KOESW7BN.js.map

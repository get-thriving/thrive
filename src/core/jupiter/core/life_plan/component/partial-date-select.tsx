import type { MilestoneSummary, PartialDate } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

import { BirthYearSelect } from "#/core/common/component/birth-year-select";
import {
  partialDateEncode,
  partialDateExtract,
} from "#/core/life_plan/partial-date";
import {
  LeafPanelExpansionState,
  useLeafPanelExpansionState,
} from "#/core/infra/leaf-panel-expansion";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { MilestoneSelect } from "#/core/life_plan/sub/milestones/components/select";

const DEFAULT_YEAR_ABSOLUTE = 1990;
const DEFAULT_YEAR_RELATIVE = 20;
const DEFAULT_DECADE_RELATIVE = 20;

interface PartialDateSelectProps {
  maxAge: number;
  allMilestones: MilestoneSummary[];
  name: string;
  initialDate?: PartialDate | null;
  disabled?: boolean;
  inputsEnabled: boolean;
}

export function PartialDateSelect(props: PartialDateSelectProps) {
  const partialDateExtracted = props.initialDate
    ? partialDateExtract(props.initialDate)
    : undefined;

  const [grossType, setGrossType] = useState<
    "absolute" | "relative" | "milestone" | "present"
  >(partialDateExtracted?.grossType ?? "absolute");
  const [relativeType, setRelativeType] = useState<"year" | "decade">(
    partialDateExtracted?.relativeType ?? "year",
  );
  const [day, setDay] = useState<number | "N/A">(
    partialDateExtracted?.day ?? "N/A",
  );
  const [month, setMonth] = useState<number | "N/A">(
    partialDateExtracted?.month ?? "N/A",
  );
  const [yearAbsolute, setYearAbsolute] = useState<number>(
    partialDateExtracted && partialDateExtracted.grossType === "absolute"
      ? partialDateExtracted.year
      : DEFAULT_YEAR_ABSOLUTE,
  );
  const [yearRelative, setYearRelative] = useState<number>(
    partialDateExtracted &&
      partialDateExtracted.grossType === "relative" &&
      partialDateExtracted.relativeType === "year"
      ? partialDateExtracted.year
      : DEFAULT_YEAR_RELATIVE,
  );
  const [decadeRelative, setDecadeRelative] = useState<number>(
    partialDateExtracted &&
      partialDateExtracted.grossType === "relative" &&
      partialDateExtracted.relativeType === "decade"
      ? partialDateExtracted.year
      : DEFAULT_DECADE_RELATIVE,
  );
  const [milestoneRefId, setMilestoneRefId] = useState<string | undefined>(
    partialDateExtracted?.milestoneRefId ?? undefined,
  );
  const [partialDate, setPartialDate] = useState<PartialDate>(
    props.initialDate ?? "",
  );

  const leafPanelExpansionState = useLeafPanelExpansionState();
  const bigScreen = useBigScreen();
  const bigStuff =
    bigScreen &&
    leafPanelExpansionState !== LeafPanelExpansionState.SMALL &&
    leafPanelExpansionState !== null;

  useEffect(() => {
    setPartialDate(
      partialDateEncode({
        grossType: grossType,
        relativeType: relativeType,
        year:
          grossType === "absolute"
            ? yearAbsolute
            : grossType === "relative" && relativeType === "year"
              ? yearRelative
              : decadeRelative,
        month,
        day,
        milestoneRefId,
      }),
    );
  }, [
    grossType,
    relativeType,
    day,
    month,
    yearAbsolute,
    yearRelative,
    decadeRelative,
    milestoneRefId,
  ]);

  return (
    <>
      <Stack direction={bigStuff ? "row" : "column"} useFlexGap spacing={1}>
        <ToggleButtonGroup
          id={`${props.name}-baseType`}
          exclusive
          fullWidth
          value={grossType}
          onChange={(event, newGrossType) => setGrossType(newGrossType)}
        >
          <ToggleButton value="absolute">Absolute</ToggleButton>
          <ToggleButton value="relative">Relative</ToggleButton>
          <ToggleButton value="milestone">Milestone</ToggleButton>
          <ToggleButton value="present">Present</ToggleButton>
        </ToggleButtonGroup>

        {grossType === "absolute" && (
          <Stack direction="row" useFlexGap spacing={1} sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel
                id={`${props.name}-Day`}
                htmlFor={`${props.name}-Day`}
              >
                Day
              </InputLabel>
              <Select
                labelId={`${props.name}-Day`}
                fullWidth
                name={`${props.name}-Day`}
                value={day.toString()}
                label="Day"
                onChange={(event) => setDay(parseInt(event.target.value, 10))}
              >
                <MenuItem value="N/A">N/A</MenuItem>
                <MenuItem value={1}>1st</MenuItem>
                <MenuItem value={2}>2nd</MenuItem>
                <MenuItem value={3}>3rd</MenuItem>
                <MenuItem value={4}>4th</MenuItem>
                <MenuItem value={5}>5th</MenuItem>
                <MenuItem value={6}>6th</MenuItem>
                <MenuItem value={7}>7th</MenuItem>
                <MenuItem value={8}>8th</MenuItem>
                <MenuItem value={9}>9th</MenuItem>
                <MenuItem value={10}>10th</MenuItem>
                <MenuItem value={11}>11th</MenuItem>
                <MenuItem value={12}>12th</MenuItem>
                <MenuItem value={13}>13th</MenuItem>
                <MenuItem value={14}>14th</MenuItem>
                <MenuItem value={15}>15th</MenuItem>
                <MenuItem value={16}>16th</MenuItem>
                <MenuItem value={17}>17th</MenuItem>
                <MenuItem value={18}>18th</MenuItem>
                <MenuItem value={19}>19th</MenuItem>
                <MenuItem value={20}>20th</MenuItem>
                <MenuItem value={21}>21st</MenuItem>
                <MenuItem value={22}>22nd</MenuItem>
                <MenuItem value={23}>23rd</MenuItem>
                <MenuItem value={24}>24th</MenuItem>
                <MenuItem value={25}>25th</MenuItem>
                <MenuItem value={26}>26th</MenuItem>
                <MenuItem value={27}>27th</MenuItem>
                <MenuItem value={28}>28th</MenuItem>
                <MenuItem value={29}>29th</MenuItem>
                <MenuItem value={30}>30th</MenuItem>
                <MenuItem value={31}>31st</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                id={`${props.name}-Month`}
                htmlFor={`${props.name}-Month`}
              >
                Month
              </InputLabel>
              <Select
                labelId={`${props.name}-Month`}
                fullWidth
                name={`${props.name}-Month`}
                value={month.toString()}
                label="Month"
                onChange={(event) => setMonth(parseInt(event.target.value, 10))}
              >
                <MenuItem value="N/A">N/A</MenuItem>
                <MenuItem value={1}>Jan</MenuItem>
                <MenuItem value={2}>Feb</MenuItem>
                <MenuItem value={3}>Mar</MenuItem>
                <MenuItem value={4}>Apr</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>Jun</MenuItem>
                <MenuItem value={7}>Jul</MenuItem>
                <MenuItem value={8}>Aug</MenuItem>
                <MenuItem value={9}>Sep</MenuItem>
                <MenuItem value={10}>Oct</MenuItem>
                <MenuItem value={11}>Nov</MenuItem>
                <MenuItem value={12}>Dec</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <BirthYearSelect
                name={`${props.name}-Year`}
                label="Year"
                value={yearAbsolute}
                inputsEnabled={props.inputsEnabled}
                allowNoneBirthYear={false}
                onChange={(year) => setYearAbsolute(year)}
              />
            </FormControl>
          </Stack>
        )}

        {grossType === "relative" && (
          <Stack direction="row" useFlexGap spacing={1} sx={{ width: "100%" }}>
            <ToggleButtonGroup
              id={`${props.name}-relativeType`}
              exclusive
              value={relativeType}
              onChange={(event, newRelativeType) =>
                setRelativeType(newRelativeType)
              }
            >
              <ToggleButton value="year">Year</ToggleButton>
              <ToggleButton value="decade">Decade</ToggleButton>
            </ToggleButtonGroup>
            {relativeType === "year" && (
              <FormControl fullWidth>
                <InputLabel
                  id={`${props.name}-Year`}
                  htmlFor={`${props.name}-Year`}
                >
                  Year
                </InputLabel>
                <Select
                  labelId={`${props.name}-Year`}
                  fullWidth
                  name={`${props.name}-Year`}
                  value={yearRelative.toString()}
                  label="Year"
                  onChange={(event) =>
                    setYearRelative(parseInt(event.target.value, 10))
                  }
                >
                  {Array.from({ length: props.maxAge }, (_, i) => (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {relativeType === "decade" && (
              <FormControl fullWidth>
                <InputLabel
                  id={`${props.name}-Decade`}
                  htmlFor={`${props.name}-Decade`}
                >
                  Decade
                </InputLabel>
                <Select
                  labelId={`${props.name}-Decade`}
                  fullWidth
                  name={`${props.name}-Decade`}
                  value={decadeRelative.toString()}
                  label="Decade"
                  onChange={(event) =>
                    setDecadeRelative(parseInt(event.target.value, 10))
                  }
                >
                  <MenuItem value={0}>0s</MenuItem>
                  {Array.from(
                    { length: props.maxAge / 10 },
                    (_, i) => i * 10,
                  ).map((decade) => (
                    <MenuItem key={decade} value={decade}>
                      {decade}s
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        )}

        {grossType === "milestone" && (
          <FormControl fullWidth>
            <MilestoneSelect
              name={`${props.name}-Milestone`}
              label="Milestone"
              inputsEnabled={props.inputsEnabled}
              disabled={false}
              allMilestones={props.allMilestones}
              defaultValue={milestoneRefId}
              value={milestoneRefId}
              onChange={(milestoneRefId) => setMilestoneRefId(milestoneRefId)}
            />
          </FormControl>
        )}
      </Stack>
      <input type="hidden" name={props.name} value={partialDate} />
    </>
  );
}

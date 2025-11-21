import { AppShell, DocsHelpSubject } from "@jupiter/webapi-client";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";
import { useContext, useState } from "react";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { FieldError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { aFieldError } from "@jupiter/core/infra/action-result";
import { loadFrontDoorInfo } from "@jupiter/core/frontdoor.server";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ButtonSingle,
  NavSingle,
  SectionActions,
  ActionsExpansion,
} from "@jupiter/core/infra/component/section-actions";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";

export async function loader({ request }: LoaderFunctionArgs) {
  const frontDoor = await loadFrontDoorInfo(
    GLOBAL_PROPERTIES.version,
    request.headers.get("Cookie"),
    request.headers.get("User-Agent"),
  );

  if (frontDoor.appShell !== AppShell.DESKTOP_ELECTRON) {
    return redirect("/app/workspace");
  }

  return json({});
}

export default function PickServer() {
  const globalProperties = useContext(GlobalPropertiesContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  const [serverUrl, setServerUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />

        <Title />

        <CommunityLink />

        <DocsHelp size="medium" subject={DocsHelpSubject.ROOT} />
      </SmartAppBar>

      <LifecyclePanel>
        <SectionCard
          title="Pick Server"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="pick-server"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ButtonSingle({
                  text: "Pick Server",
                  highlight: true,
                  onClick: async () => {
                    const res = await window.pickServer.pickServer(serverUrl);
                    if (res.result === "error") {
                      setErrorMessage(res.errorMsg);
                    }
                  },
                }),
                NavSingle({
                  text: "Go Back",
                  link: "/app/workspace",
                }),
              ]}
            />
          }
        >
          <FormControl fullWidth>
            <InputLabel id="server-url">Server URL</InputLabel>
            <OutlinedInput
              label="Server URL"
              name="serverUrl"
              type="text"
              readOnly={!inputsEnabled}
              value={serverUrl}
              onChange={(event) => setServerUrl(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    disabled={!inputsEnabled}
                    onClick={() =>
                      setServerUrl(globalProperties.hostedGlobalDomain)
                    }
                  >
                    Use Global
                  </Button>
                </InputAdornment>
              }
            />

            <Typography variant="caption" sx={{ paddingTop: "1rem" }}>
              Examples:
              <ul>
                <li>
                  <code>thrive-test.com</code> (assumes https)
                </li>
                <li>
                  <code>http://thrive-test.com</code>
                </li>
                <li>
                  <code>https://my-thrive-instance.io</code>
                </li>
                <li>
                  <code>http://32.18.23.128:10000</code>
                </li>
              </ul>
              You can learn more about self-hosting in the docs:
              <DocsHelp size="small" subject={DocsHelpSubject.SELF_HOSTING} />.
            </Typography>

            {errorMessage && (
              <FieldError
                actionResult={aFieldError("server_url", errorMessage)}
                fieldName="server_url"
              />
            )}
          </FormControl>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

import type { LoaderFunctionArgs } from "@remix-run/node";
import ical from "ical-generator";

import { getGuestApiClient } from "~/api-clients.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const externalId = params.externalId;
  if (!externalId) {
    throw new Response("Missing externalId", { status: 400 });
  }

  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.schedule.scheduleExportLoadByExternalId({
    external_id: externalId,
  });

  const calendar = ical({
    name: result.export.name,
  });

  for (const streamEntry of result.entries) {
    for (const eventEntry of streamEntry.schedule_event_in_day_entries) {
      const start = new Date(
        `${eventEntry.time_event.start_date}T${eventEntry.time_event.start_time_in_day}:00Z`,
      );
      const end = new Date(
        start.getTime() + eventEntry.time_event.duration_mins * 60 * 1000,
      );

      calendar.createEvent({
        id: `in-day-${streamEntry.schedule_stream.schedule_domain_ref_id}-${streamEntry.schedule_stream.ref_id}-${eventEntry.event.ref_id}@get-thriving.com`,
        summary: eventEntry.event.name,
        start,
        end,
      });
    }

    for (const eventEntry of streamEntry.schedule_event_full_days_entries) {
      const start = new Date(`${eventEntry.time_event.start_date}T00:00:00Z`);
      const end = new Date(start.getTime());
      end.setUTCDate(end.getUTCDate() + eventEntry.time_event.duration_days);

      calendar.createEvent({
        id: `full-days-${streamEntry.schedule_stream.schedule_domain_ref_id}-${streamEntry.schedule_stream.ref_id}-${eventEntry.event.ref_id}@get-thriving.com`,
        summary: eventEntry.event.name,
        start,
        end,
        allDay: true,
      });
    }
  }

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="schedule-export-${externalId}.ics"`,
    },
  });
}

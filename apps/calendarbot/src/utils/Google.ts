import {google} from "googleapis";
import {z} from "zod";

const GDate = z.object({
  date: z.date(),
  dateTime: z.string().datetime(),
  timeZone: z.string()
});

const GUser = z.object({
    id: z.string(),
    email: z.string(),
    displayName: z.string(),
    self: z.boolean()
});
const GEventSchema = z.object({
  kind: z.literal("calendar#event"),
  etag: z.string(),
  id: z.string(),
  status: z.string(),
  htmlLink: z.string().url(),
  created: z.date(),
  updated: z.date(),
  summary: z.string(),
  description: z.string(),
  location: z.string(),
  colorId: z.string(),
  creator: GUser,
  organizer: GUser,
  start: GDate,
  end: GDate,
  endTimeUnspecified: z.boolean(),
  recurrence: z.array(z.string()),
  recurringEventId: z.string(),
  originalStartTime: GDate,
  transparency: z.string(),
  visibility: z.string(),
  iCalUID: z.string(),
  sequence: z.string(),
  attendees: z.array(GUser.extend({
    organizer: z.boolean(),
    self: z.boolean(),
    resource: z.boolean(),
    optional: z.boolean(),
    responseStatus: z.string(),
    comment: z.string(),
    additionalGuests: z.number()
  })),
  attendeesOmitted: z.boolean(),
  anyoneCanAddSelf: z.boolean(),
  guestsCanInviteOthers: z.boolean(),
  guestsCanModify: z.boolean(),
  guestsCanSeeOtherGuests: z.boolean(),
  privateCopy: z.boolean(),
  locked: z.boolean(),
  reminders: z.object({
    useDefault: z.boolean(),
    overrides: z.array(z.object({
      method: z.string(),
      minutes: z.string()
    }))
  }),
  source: z.object({
    url: z.string(),
    title: z.string()
  }),
  attachments: z.array(
    z.object({
      fileUrl: z.string(),
      title: z.string(),
      mimeType: z.string(),
      iconLink: z.string(),
      fileId: z.string()
    })
  ) 
});

const GetEventsSchema = z.object({
  kind: z.literal("calendar#events"),
  etag: z.string(),
  summary: z.string(),
  description: z.string(),
  updated: z.date(),
  timeZone: z.string(),
  accessRole: z.string(),
  defaultReminders: z.array(
    z.object({
      method: z.string(),
      minutes: z.number()
    })
  ),
  nextPageToken: z.string(),
  nextSyncToken: z.string(),
  items: z.array(GEventSchema)

})

type GetEvents = z.infer<typeof GetEventsSchema>;


function getAuth()
{
  return new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_FILE,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  });
}

export async function GetCalendarEvents(calendarId: string): Promise<GetEvents|undefined>
{
  const auth = getAuth();
  const calendar = google.calendar({version: 'v3', auth});

  const res = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 1000,
    singleEvents: true,
    orderBy: 'startTime'
  });
  const schema = GetEventsSchema.safeParse(res.data);

  if(schema.success)
    return schema.data

  console.warn(schema.error);
  return;

}

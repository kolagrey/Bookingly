import { google } from 'googleapis'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`
)

export const googleCalendarService = {
  async getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events.readonly',
      'https://www.googleapis.com/auth/calendar.readonly',
    ]

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    })
  },

  async handleCallback(code: string, userId: string) {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Store tokens in database
    await supabase
      .from('user_integrations')
      .upsert({
        user_id: userId,
        provider: 'google_calendar',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expiry_date!).toISOString(),
      })

    return tokens
  },

  async getEvents(userId: string, startTime: Date, endTime: Date) {
    // Get tokens from database
    const { data: integration } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google_calendar')
      .single()

    if (!integration) return []

    // Check if token needs refresh
    if (new Date(integration.expires_at) < new Date()) {
      oauth2Client.setCredentials({
        refresh_token: integration.refresh_token,
      })
      const { credentials } = await oauth2Client.refreshAccessToken()
      
      // Update tokens in database
      await supabase
        .from('user_integrations')
        .update({
          access_token: credentials.access_token,
          expires_at: new Date(credentials.expiry_date!).toISOString(),
        })
        .eq('user_id', userId)
        .eq('provider', 'google_calendar')

      oauth2Client.setCredentials(credentials)
    } else {
      oauth2Client.setCredentials({
        access_token: integration.access_token,
        refresh_token: integration.refresh_token,
      })
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    return response.data.items?.map(event => ({
      start: event.start?.dateTime || event.start?.date!,
      end: event.end?.dateTime || event.end?.date!,
    })) || []
  },
}
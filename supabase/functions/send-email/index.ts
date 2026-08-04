import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  to: string
  template: 'welcome' | 'booking_received' | 'booking_approved' | 'booking_rejected' | 'reminder' | 'password_reset'
  data: Record<string, string>
}

function getEmailTemplate(template: string, data: Record<string, string>): { subject: string; html: string } {
  const baseStyle = `font-family: 'Cormorant Garamond', Georgia, serif; background-color: #FDFBF7; color: #292926; max-width: 600px; margin: 0 auto; padding: 40px;`
  const header = `
    <div style="${baseStyle}">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 28px; color: #1C1C1A; margin: 0;">B'trix Design</h1>
        <p style="font-size: 14px; color: #C29A3D; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Where Elegance Meets Craftsmanship</p>
        <hr style="border: none; border-top: 1px solid #E0C784; margin: 16px auto; width: 60px;" />
      </div>`
  const footer = `
      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #EBDFC4; text-align: center;">
        <p style="font-size: 12px; color: #888880;">© ${new Date().getFullYear()} B'trix Design. All rights reserved.</p>
        <p style="font-size: 12px; color: #888880; margin-top: 4px;">hello@btrixdesign.com · Monrovia, Liberia</p>
      </div>
    </div>`

  const templates: Record<string, { subject: string; html: string }> = {
    welcome: {
      subject: 'Welcome to B\'trix Design',
      html: `${header}
        <h2 style="font-size: 24px; color: #1C1C1A;">Welcome, ${data.name || 'there'}!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">Thank you for joining B'trix Design. Your account has been created successfully.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">You can now book appointments, save your favorite designs, and manage your profile. We look forward to helping you create something beautiful.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '') ?? ''}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #E0C784, #C29A3D); color: #1C1C1A; text-decoration: none; font-weight: 600; border-radius: 4px;">Visit Your Dashboard</a>
        </div>${footer}`,
    },
    booking_received: {
      subject: 'Appointment Request Received',
      html: `${header}
        <h2 style="font-size: 24px; color: #1C1C1A;">We received your request!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">Thank you for booking with B'trix Design. Here are your appointment details:</p>
        <div style="background: #FAF5EC; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #52524C;"><strong>Service:</strong> ${data.service || 'Consultation'}</p>
          <p style="margin: 4px 0; color: #52524C;"><strong>Date:</strong> ${data.date || 'TBD'}</p>
          <p style="margin: 4px 0; color: #52524C;"><strong>Time:</strong> ${data.time || 'TBD'}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">Our team will review your request and confirm your appointment within 48 hours.</p>${footer}`,
    },
    booking_approved: {
      subject: 'Your Appointment is Confirmed!',
      html: `${header}
        <h2 style="font-size: 24px; color: #1C1C1A;">Great news, ${data.name || 'there'}!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">Your appointment has been approved and confirmed. We can't wait to see you!</p>
        <div style="background: #FAF5EC; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #52524C;"><strong>Service:</strong> ${data.service || 'Consultation'}</p>
          <p style="margin: 4px 0; color: #52524C;"><strong>Date:</strong> ${data.date || 'TBD'}</p>
          <p style="margin: 4px 0; color: #52524C;"><strong>Time:</strong> ${data.time || 'TBD'}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>${footer}`,
    },
    booking_rejected: {
      subject: 'Update on Your Appointment Request',
      html: `${header}
        <h2 style="font-size: 24px; color: #1C1C1A;">Hello, ${data.name || 'there'}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">Unfortunately, we were unable to accommodate your appointment request for ${data.date || 'the requested date'}.</p>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">This may be due to scheduling conflicts. We'd love to help you find another time that works. Please book a new appointment at your convenience.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="#" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #E0C784, #C29A3D); color: #1C1C1A; text-decoration: none; font-weight: 600; border-radius: 4px;">Book New Appointment</a>
        </div>${footer}`,
    },
    reminder: {
      subject: 'Appointment Reminder',
      html: `${header}
        <h2 style="font-size: 24px; color: #1C1C1A;">See you soon, ${data.name || 'there'}!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">This is a friendly reminder about your upcoming appointment at B'trix Design.</p>
        <div style="background: #FAF5EC; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #52524C;"><strong>Service:</strong> ${data.service || 'Consultation'}</p>
          <p style="margin: 4px 0; color: #52524C;"><strong>Date:</strong> ${data.date || 'TBD'}</p>
          <p style="margin: 4px 0; color: #52524C;"><strong>Time:</strong> ${data.time || 'TBD'}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">We look forward to seeing you. If you need to reschedule, please contact us as soon as possible.</p>${footer}`,
    },
    password_reset: {
      subject: 'Password Reset Request',
      html: `${header}
        <h2 style="font-size: 24px; color: #1C1C1A;">Reset Your Password</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #52524C;">We received a request to reset your password. Click the button below to set a new password.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.reset_link || '#'}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #E0C784, #C29A3D); color: #1C1C1A; text-decoration: none; font-weight: 600; border-radius: 4px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #888880;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>${footer}`,
    },
  }

  return templates[template] ?? templates.welcome
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { to, template, data }: EmailRequest = await req.json()

    if (!to || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, template' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { subject, html } = getEmailTemplate(template, data)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'B\'trix Design <hello@btrixdesign.com>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return new Response(
        JSON.stringify({ error: `Failed to send email: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const result = await res.json()
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

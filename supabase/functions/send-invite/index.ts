import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { email, inviteLink, role, petName } = await req.json();

        console.log(`Sending invite to ${email} for role ${role} for pet ${petName}`);

        const resendApiKey = Deno.env.get('RESEND_API_KEY');

        if (resendApiKey) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Pawzly <onboarding@resend.dev>', // User should update this domain
                    to: email,
                    subject: `You've been invited to manage ${petName} on Pawzly`,
                    html: `<p>Click here to accept the invite: <a href="${inviteLink}">${inviteLink}</a></p>`
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Resend API error:', errorData);
                throw new Error('Failed to send email via Resend');
            }
        } else {
            console.log('RESEND_API_KEY not set. Mocking email send.');
            console.log(`To: ${email}, Link: ${inviteLink}`);
            // Mock success delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return new Response(
            JSON.stringify({ message: "Invite sent successfully" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});

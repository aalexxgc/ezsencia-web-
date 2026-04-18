export const config = { runtime: 'edge' };

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { nombre, email, ciudad, motivo, origen } = body;

    if (!nombre || !email || !ciudad || !motivo || !origen) {
        return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const SUPABASE_URL    = process.env.SUPABASE_URL;
    const SUPABASE_ANON   = process.env.SUPABASE_ANON_KEY;
    const RESEND_KEY      = process.env.RESEND_API_KEY;
    const NOTIFY_EMAIL    = process.env.NOTIFY_EMAIL || 'founder@ezsencia.com';

    // 1. Guardar en Supabase
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/solicitudes`, {
        method:  'POST',
        headers: {
            'Content-Type':  'application/json',
            'apikey':        SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'Prefer':        'return=minimal'
        },
        body: JSON.stringify({ nombre, email, ciudad, motivo, origen })
    });

    if (!dbRes.ok) {
        const err = await dbRes.text();
        console.error('Supabase error:', err);
        return new Response(JSON.stringify({ error: 'Error al guardar la solicitud' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 2. Email de notificación a Ezsencia
    await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
            from:    'Ezsencia Web <noreply@ezsencia.com>',
            to:      [NOTIFY_EMAIL],
            subject: `Nueva solicitud de invitación — ${nombre}`,
            html: `
                <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1916;">
                    <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9a7d4a;">Nueva solicitud · Ezsencia</p>
                    <h2 style="font-size:24px;font-weight:400;margin:8px 0 32px;">${nombre}</h2>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr><td style="padding:12px 0;border-bottom:1px solid #e8e3da;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;width:120px;">Email</td><td style="padding:12px 0;border-bottom:1px solid #e8e3da;">${email}</td></tr>
                        <tr><td style="padding:12px 0;border-bottom:1px solid #e8e3da;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Ciudad</td><td style="padding:12px 0;border-bottom:1px solid #e8e3da;">${ciudad}</td></tr>
                        <tr><td style="padding:12px 0;border-bottom:1px solid #e8e3da;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;vertical-align:top;">Motivo</td><td style="padding:12px 0;border-bottom:1px solid #e8e3da;">${motivo}</td></tr>
                        <tr><td style="padding:12px 0;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;vertical-align:top;">Origen</td><td style="padding:12px 0;">${origen}</td></tr>
                    </table>
                    <p style="margin-top:40px;font-size:12px;color:#aaa;">Ezsencia · ezsencia.com</p>
                </div>
            `
        })
    });

    // 3. Email de confirmación al solicitante
    await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
            from:    'Ezsencia <hola@ezsencia.com>',
            to:      [email],
            subject: 'Hemos recibido tu solicitud — Ezsencia',
            html: `
                <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1916;padding:40px 20px;">
                    <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9a7d4a;margin-bottom:32px;">Ezsencia · Truffle Society</p>
                    <h2 style="font-size:28px;font-weight:400;font-style:italic;line-height:1.2;margin:0 0 24px;">Hola, ${nombre}.</h2>
                    <p style="line-height:1.9;color:#555;margin-bottom:16px;">
                        Hemos recibido tu solicitud para la Edición Fundadores 2026.
                    </p>
                    <p style="line-height:1.9;color:#555;margin-bottom:40px;">
                        Revisamos cada candidatura de forma personal.
                        Recibirás nuestra respuesta en un plazo máximo de 7 días.
                    </p>
                    <p style="font-size:12px;color:#aaa;border-top:1px solid #e8e3da;padding-top:24px;">
                        Ezsencia · Alcotas, Teruel · <a href="https://ezsencia.com" style="color:#9a7d4a;">ezsencia.com</a>
                    </p>
                </div>
            `
        })
    });

    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

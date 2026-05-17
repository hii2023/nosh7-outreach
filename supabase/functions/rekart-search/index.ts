const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const { phone, token } = await req.json();
  if (!phone || !token) {
    return new Response(JSON.stringify({ error: 'phone and token required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const res = await fetch('https://app.rekart.io/api/panel/user/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      searchBy: 'name',
      query: phone,
      _token: '',
      sclid: null,
      sstid: null,
      appType: 'AdminPanel',
      appVersion: '3.41.0',
      platform: 'browser',
    }),
  });

  const data = await res.json();
  const list = data?.data?.list ?? [];
  const first = list[0];

  return new Response(JSON.stringify({
    id: first?.id ?? null,
    name: first?.name ?? null,
    count: list.length,
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});

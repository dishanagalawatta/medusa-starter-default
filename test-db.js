const { Client } = require('pg');

async function test(url, name) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    await client.query('SELECT 1 as success');
    console.log(`[SUCCESS] ${name}`);
    await client.end();
  } catch (err) {
    console.log(`[FAILED] ${name} ->`, err.message);
  }
}

const pooler6543_supavisor = "postgresql://postgres.puoxvrrnqpswuhtsgmxk:8hDQW97c%26%2Av%254o@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
const pooler6543_legacy = "postgresql://postgres:8hDQW97c%26%2Av%254o@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
const pooler5432_legacy = "postgresql://postgres:8hDQW97c%26%2Av%254o@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true";

async function run() {
  await test(pooler6543_supavisor, "Pooler 6543 (postgres.ref)");
  await test(pooler6543_legacy, "Pooler 6543 (postgres)");
  await test(pooler5432_legacy, "Pooler 5432 (postgres)");
}

run();



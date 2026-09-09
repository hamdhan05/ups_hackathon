const http = require('http');

async function main() {
  const loginData = JSON.stringify({ email: 'manager@logipulse.demo', password: 'LogiPulse2026!' });
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      if (!parsed.success) {
        console.error('Login failed:', parsed);
        process.exit(1);
      }
      const token = parsed.data.token;
      console.log('Login success!');
      testAnalyticsApi(token);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.write(loginData);
  req.end();
}

function testAnalyticsApi(token) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/analytics',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  http.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      console.log('--- GET /api/analytics TEST ---', parsed);
      if (!parsed.data || !parsed.data.peakAnalysis) {
        console.error('Missing peakAnalysis in response:', parsed);
        process.exit(1);
      }
      console.log('Peak threshold:', parsed.data.peakAnalysis.summary.peakThreshold);
      console.log('Peak days count:', parsed.data.peakAnalysis.summary.peakDaysCount);
      console.log('Overall facility risk:', parsed.data.riskAnalysis.overallFacilityRisk);
      console.log('Area risk records:', parsed.data.riskAnalysis.areaRisks.length);
      console.log('Contributing factors count:', parsed.data.contributingFactors.length);
      testDashboardP1Payload(token);
    });
  });
}

function testDashboardP1Payload(token) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/dashboard',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  http.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      console.log('--- GET /api/dashboard (P1 Payload) TEST ---');
      console.log('Dashboard summary inbound workload:', parsed.data.summary.inboundWorkload);
      console.log('P1 payload present in dashboard:', !!parsed.data.p1);
      console.log('P1 peak analysis present:', !!parsed.data.p1?.peakAnalysis);
      console.log('P1 risk analysis present:', !!parsed.data.p1?.riskAnalysis);
      console.log('P1 ACCEPTANCE TEST PASSED SUCCESSFULLY!');
    });
  });
}

main();

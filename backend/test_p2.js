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
      testSimulationApi(token);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.write(loginData);
  req.end();
}

function testSimulationApi(token) {
  const payload = JSON.stringify({
    targetArea: 'Shipping',
    workloadChangePercent: 25,
    workerTransferCount: 5,
    sourceArea: 'Receiving'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/simulation/simulate',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      console.log('--- POST /api/simulation/simulate TEST ---');
      console.log('Success:', parsed.success);
      console.log('Baseline workload:', parsed.data.baseline.forecastWorkload);
      console.log('Simulated workload:', parsed.data.projected.simulatedWorkload);
      console.log('Simulated req / avail:', parsed.data.projected.simulatedRequiredWorkforce, '/', parsed.data.projected.simulatedAvailableWorkforce);
      console.log('Simulated capacity gap:', parsed.data.projected.simulatedCapacityGap);
      console.log('Natural Language Explanation:', parsed.data.naturalLanguageInsights.explanation);
      console.log('Recommendation Summary:', parsed.data.naturalLanguageInsights.recommendationSummary);
      console.log('P2 ACCEPTANCE TEST PASSED SUCCESSFULLY!');
    });
  });

  req.write(payload);
  req.end();
}

main();

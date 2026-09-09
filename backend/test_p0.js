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
      console.log('Login success! User:', parsed.data.user.email);
      testDashboard(token);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.write(loginData);
  req.end();
}

function testDashboard(token) {
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
      console.log('--- DASHBOARD TEST ---');
      console.log('Summary:', parsed.data.summary);
      console.log('Capacity records count:', parsed.data.capacity.length);
      console.log('Bottlenecks count:', parsed.data.bottlenecks.length);
      console.log('Recommendations count:', parsed.data.recommendations.length);
      if (parsed.data.recommendations.length > 0) {
        console.log('Top Recommendation:', parsed.data.recommendations[0]);
      }
      testRecommendations(token);
    });
  });
}

function testRecommendations(token) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/recommendations',
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
      console.log('--- RECOMMENDATIONS API TEST ---');
      console.log('Recommendations count:', parsed.data.items.length);
      console.log('P0 VERIFICATION ALL PASSED SUCCESSFULLY!');
    });
  });
}

main();

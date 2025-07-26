// Simple API test script
const BASE_URL = 'http://localhost:5000';

const testEndpoints = async () => {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test nearby suppliers endpoint
    console.log('\n2. Testing nearby suppliers endpoint...');
    const suppliersResponse = await fetch(`${BASE_URL}/api/suppliers/nearby?lat=13.0827&lon=80.2707&radius=50`);
    const suppliersData = await suppliersResponse.json();
    console.log('✅ Nearby suppliers:', suppliersData.count, 'suppliers found');

    // Test products endpoint
    console.log('\n3. Testing products endpoint...');
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products:', productsData.count, 'products found');

    // Test product categories endpoint
    console.log('\n4. Testing product categories endpoint...');
    const categoriesResponse = await fetch(`${BASE_URL}/api/products/categories/list`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Product categories:', categoriesData.data.length, 'categories found');

    // Test price comparison endpoint
    console.log('\n5. Testing price comparison endpoint...');
    const compareResponse = await fetch(`${BASE_URL}/api/products/compare?name=Tomato`);
    const compareData = await compareResponse.json();
    console.log('✅ Price comparison:', compareData.count, 'products compared');

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- Health endpoint: ✅');
    console.log('- Nearby suppliers: ✅');
    console.log('- Products listing: ✅');
    console.log('- Product categories: ✅');
    console.log('- Price comparison: ✅');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:5000');
    console.log('💡 Run: npm run server:dev');
  }
};

// Run tests
testEndpoints(); 
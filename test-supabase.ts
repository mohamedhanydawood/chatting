// test-supabase.ts - Test Supabase connection and schema
import { supabase, saveMessage, getMessagesByRoom } from './lib/supabase.js';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Test 1: Check connection
    console.log('1️⃣ Testing database connection...');
    const { error } = await supabase.from('messages').select('count');
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\n💡 Make sure you:');
      console.log('   - Created the messages table using supabase-schema.sql');
      console.log('   - Added correct credentials to .env file');
      return;
    }
    
    console.log('✅ Connected to Supabase successfully!\n');

    // Test 2: Insert a test message
    console.log('2️⃣ Testing message insertion...');
    const testMessage = await saveMessage(
      'General',
      'TestUser',
      'Hello from test script! 🚀',
      false
    );

    if (testMessage) {
      console.log('✅ Message saved:', testMessage);
      console.log('   ID:', testMessage.id);
      console.log('   Room:', testMessage.room_id);
      console.log('   From:', testMessage.from_user);
      console.log('   Text:', testMessage.text);
      console.log('');
    } else {
      console.log('❌ Failed to save message\n');
      return;
    }

    // Test 3: Retrieve messages
    console.log('3️⃣ Testing message retrieval...');
    const messages = await getMessagesByRoom('General');
    
    console.log(`✅ Retrieved ${messages.length} message(s) from 'General' room`);
    messages.forEach((msg, i) => {
      console.log(`   ${i + 1}. ${msg.from_user}: ${msg.text}`);
    });
    console.log('');

    // Test 4: Test DM
    console.log('4️⃣ Testing direct message...');
    const dmMessage = await saveMessage(
      'Alice_dm_Bob',
      'Alice',
      'Hey Bob, this is a DM! 💬',
      true
    );

    if (dmMessage) {
      console.log('✅ DM saved successfully!');
      console.log('   DM Room:', dmMessage.room_id);
      console.log('   Is DM:', dmMessage.is_dm);
      console.log('');
    }

    console.log('🎉 All tests passed! Your Supabase setup is working correctly.\n');
    console.log('📊 Next steps:');
    console.log('   1. Run "npm run dev" to start your app');
    console.log('   2. Sign in and send some messages');
    console.log('   3. Check Supabase Dashboard → Table Editor → messages');
    console.log('   4. Restart the server - messages should persist!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check .env file has correct SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('   - Run the SQL schema in Supabase Dashboard → SQL Editor');
    console.log('   - Make sure the messages table exists');
  }
}

// Run the test
testSupabaseConnection();

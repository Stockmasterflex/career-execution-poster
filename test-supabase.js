const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ymsmmcfbnonyrzegfvxe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltc21tY2Zibm9ueXJ6ZWdmdnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNzc3NzgsImV4cCI6MjA3Mjk1Mzc3OH0.seVUls6Wb7jQDNOWBI82wRV8hPClmH2o8lbzF62nPIA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.auth.getSession()
    console.log('Connection successful!')
    console.log('Session:', data.session)
    console.log('Error:', error)
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()

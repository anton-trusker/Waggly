import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  })
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase URL or Anon Key in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function main() {
  console.log('🧪 Testing Edge Functions...')

  // 1. Sign Up / Sign In Test User
  const email = `test-${Date.now()}@example.com`
  const password = 'test-password-123'

  console.log(`Creating test user: ${email}`)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    console.error('Auth error:', authError.message)
    process.exit(1)
  }

  const token = authData.session?.access_token
  if (!token) {
    console.error('No access token received. Maybe email confirmation is required?')
    // Try sign in if user already exists (unlikely with timestamp)
    process.exit(1)
  }

  console.log('✅ Authentication successful')

  // 2. Call api-v1-pets (List Pets) - Should be empty initially
  console.log('\nTesting GET /pets...')
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/api-v1-pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(JSON.stringify(data))
    }
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data.pets && Array.isArray(data.pets)) {
      console.log('✅ GET /pets success')
    } else {
      console.error('❌ GET /pets failed: Invalid response format')
    }
  } catch (error) {
    console.error('❌ GET /pets failed:', error)
  }

  // 3. Call api-v1-pets (Create Pet)
  console.log('\nTesting POST /pets...')
  let petId = ''
  try {
    const petData = {
      name: 'Test Pet',
      species: 'dog',
      gender: 'male',
      date_of_birth: '2023-01-01',
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/api-v1-pets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(JSON.stringify(data))
    }
    console.log('Response:', JSON.stringify(data, null, 2))

    if (data.pet && data.pet.id) {
      petId = data.pet.id
      console.log('✅ POST /pets success')
    } else {
      console.error('❌ POST /pets failed: Invalid response format')
    }
  } catch (error) {
    console.error('❌ POST /pets failed:', error)
  }

  if (petId) {
    // 4. Call api-v1-pet-detail (Get Pet)
    console.log(`\nTesting GET /pet-detail?id=${petId}...`)
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/api-v1-pet-detail?id=${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }
      console.log('Response:', JSON.stringify(data, null, 2))

      if (data.pet && data.pet.id === petId) {
        console.log('✅ GET /pet-detail success')
      } else {
        console.error('❌ GET /pet-detail failed: Invalid response format')
      }
    } catch (error) {
      console.error('❌ GET /pet-detail failed:', error)
    }

    // 5. Call api-v1-pet-detail (Update Pet)
    console.log(`\nTesting PUT /pet-detail...`)
    try {
      const updateData = {
        id: petId,
        name: 'Updated Test Pet',
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/api-v1-pet-detail`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }
      console.log('Response:', JSON.stringify(data, null, 2))

      if (data.pet && data.pet.name === 'Updated Test Pet') {
        console.log('✅ PUT /pet-detail success')
      } else {
        console.error('❌ PUT /pet-detail failed: Invalid response format')
      }
    } catch (error) {
      console.error('❌ PUT /pet-detail failed:', error)
    }

    // 6. Call api-v1-pet-detail (Delete Pet)
    console.log(`\nTesting DELETE /pet-detail...`)
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/api-v1-pet-detail`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: petId }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }
      console.log('Response:', JSON.stringify(data, null, 2))
      console.log('✅ DELETE /pet-detail success')
    } catch (error) {
      console.error('❌ DELETE /pet-detail failed:', error)
    }
  }

  // Cleanup user? (Optional, maybe keep for manual check)
  console.log('\nTest complete.')
}

main().catch(console.error)

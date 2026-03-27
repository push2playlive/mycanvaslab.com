#!/bin/bash

# Supabase Setup Script for AI Workspace IDE
# This script provides instructions and automates environment variable setup.

echo "🚀 Starting Supabase Integration..."

# 1. Check if .env exists, if not create it from example
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
fi

echo ""
echo "📝 STEP 1: Supabase Dashboard Setup"
echo "--------------------------------------------------"
echo "1. Go to https://supabase.com and create a new project."
echo "2. Once the project is ready, go to the 'SQL Editor' in the sidebar."
echo "3. Click 'New query' and paste the contents of 'supabase-setup.sql'."
echo "4. Click 'Run' to create the tables and RLS policies."
echo "--------------------------------------------------"

echo ""
echo "🔑 STEP 2: API Keys"
echo "--------------------------------------------------"
echo "1. Go to 'Project Settings' > 'API'."
echo "2. Copy the 'Project URL' and 'anon public' key."
echo "3. Update your .env file with these values:"
echo "   VITE_SUPABASE_URL=your_project_url"
echo "   VITE_SUPABASE_ANON_KEY=your_anon_key"
echo "--------------------------------------------------"

echo ""
echo "📦 STEP 3: Client Initialization"
echo "--------------------------------------------------"
echo "The client is already initialized in 'src/lib/supabase.ts'."
echo "You can import it using: import { supabase } from '@/lib/supabase';"
echo "--------------------------------------------------"

echo ""
echo "🎉 Setup Complete! Your AI Workspace is ready for Supabase."

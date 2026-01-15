#!/usr/bin/env node

/**
 * Simple demo script to test business personas
 * This demonstrates how the new business-focused conversational agents work
 */

const path = require('path');
const fs = require('fs');

const BASE_DIR = path.join(__dirname);
const DATA_DIR = path.join(BASE_DIR, 'data');

console.log('='.repeat(80));
console.log('Business Persona Demo - Testing Characters 7, 8, 9');
console.log('='.repeat(80));
console.log();

// Test loading persona and conversation for each business character
const businessCharacters = [
  { id: 7, name: 'Emma', role: 'Customer Support' },
  { id: 8, name: 'Alex Chen', role: 'HR Assistant' },
  { id: 9, name: 'Marcus Rivera', role: 'Sales Advisor' }
];

businessCharacters.forEach(char => {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`Testing Character ${char.id}: ${char.name} - ${char.role}`);
  console.log('─'.repeat(80));
  
  // Load persona
  const personaPath = path.join(DATA_DIR, `persona${char.id}.txt`);
  const personaContent = fs.readFileSync(personaPath, 'utf-8');
  
  console.log('\n📋 PERSONA:');
  console.log(personaContent.split('\n').slice(0, 4).join('\n'));
  console.log('...');
  
  // Load conversation
  const conversationPath = path.join(DATA_DIR, `conversation${char.id}.json`);
  const conversation = JSON.parse(fs.readFileSync(conversationPath, 'utf-8'));
  
  // Get initial node
  const initialNode = conversation.find(node => node.id === 'initial');
  
  console.log('\n💬 INITIAL GREETING:');
  console.log(`   "${initialNode.content}"`);
  
  console.log('\n🎯 AVAILABLE INTENTS:');
  initialNode.intents.forEach((intent, idx) => {
    console.log(`   ${idx + 1}. "${intent.content}" → ${intent.targetNodeId}`);
  });
  
  console.log('\n📊 CONVERSATION STATS:');
  console.log(`   Total nodes: ${conversation.length}`);
  console.log(`   Global nodes: ${conversation.filter(n => n.global).length}`);
  console.log(`   Conversation flows: ${conversation.filter(n => n.intents && n.intents.length > 0).length}`);
  
  // Check for template variables
  const conversationStr = JSON.stringify(conversation);
  const templates = conversationStr.match(/\{\{[^}]+\}\}/g) || [];
  if (templates.length > 0) {
    const uniqueTemplates = [...new Set(templates)];
    console.log(`\n🔧 CONFIGURABLE VARIABLES: ${uniqueTemplates.length}`);
    uniqueTemplates.slice(0, 3).forEach(t => console.log(`   - ${t}`));
    if (uniqueTemplates.length > 3) {
      console.log(`   ... and ${uniqueTemplates.length - 3} more`);
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log('✅ All business personas loaded successfully!');
console.log('='.repeat(80));
console.log('\nTo test these in action:');
console.log('1. Start the server: npm run start:dev');
console.log('2. Send POST request to /chat with characterId 7, 8, or 9');
console.log('3. See BUSINESS_EXAMPLES.md for detailed integration examples');
console.log();

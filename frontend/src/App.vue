<template>
  <div class="container">
    <header class="header">
      <h1>📧 EML Analyzer Report</h1>
      <p>Email Analysis & Summary</p>
    </header>

    <div class="controls">
      <button @click="fetchEmails" :disabled="loading" class="btn-primary">
        {{ loading ? 'Analyzing...' : 'Analyze EML Files' }}
      </button>
      <div class="stats" v-if="emails.length > 0">
        <span>Total: {{ emails.length }} emails</span>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Analyzing EML files...</p>
    </div>

    <div v-if="error" class="error">
      <p>❌ {{ error }}</p>
    </div>

    <table v-if="emails.length > 0" class="report-table">
      <thead>
        <tr>
          <th>발신자 (Sender)</th>
          <th>제목 (Subject)</th>
          <th>발신일 (Date)</th>
          <th>주요 내용 (Preview)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="email in emails" :key="email.id" class="email-row">
          <td class="sender">{{ email.sender }}</td>
          <td class="subject">{{ email.subject }}</td>
          <td class="date">{{ email.date }}</td>
          <td class="content">{{ truncateText(email.mainContent, 80) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && emails.length === 0 && !error" class="empty">
      <p>📁 No EML files found. Click "Analyze EML Files" to start.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const emails = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchEmails = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await axios.get('/api/emails/analyze')
        if (response.data.success) {
          emails.value = response.data.data
        } else {
          error.value = 'Failed to analyze emails'
        }
      } catch (err) {
        error.value = `Error: ${err.message}. Make sure backend is running on http://localhost:3001`
      } finally {
        loading.value = false
      }
    }

    const truncateText = (text, length) => {
      if (!text) return 'N/A'
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    return {
      emails,
      loading,
      error,
      fetchEmails,
      truncateText
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.1em;
  opacity: 0.9;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.btn-primary {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #999;
  cursor: not-allowed;
}

.stats {
  font-size: 1.1em;
  color: #666;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background: #fee;
  color: #c33;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

.report-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.report-table td {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.email-row:hover {
  background: #f9f9f9;
}

.sender {
  font-weight: 500;
  color: #667eea;
  max-width: 200px;
  word-break: break-word;
}

.subject {
  font-weight: 500;
  color: #333;
  max-width: 250px;
}

.date {
  color: #999;
  min-width: 100px;
}

.content {
  color: #666;
  font-size: 0.9em;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1em;
}
</style>

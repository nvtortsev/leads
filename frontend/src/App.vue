<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const leads = ref([])
const isLoading = ref(false)
const value = ref('')
const expandedRowKeys = ref([])

const fetchLeads = async (searchValue) => {
  try {
    isLoading.value = true
    const params = {
      query: searchValue
    }
    const { data } = await axios.get(`http://localhost:3000/api/leads/`, { params })
    setTimeout(() => {
      leads.value = data.map((lead) => ({
        ...lead,
        key: lead.id
      }))
      isLoading.value = false
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

const columns = [
  {
    title: 'Название',
    dataIndex: 'title',
    key: 'title',
    fixed: true
  },
  {
    title: 'Бюджет',
    dataIndex: 'budget',
    key: 'budget'
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Ответственный',
    dataIndex: 'responsible',
    key: 'responsible'
  },
  {
    title: 'Дата создания',
    dataIndex: 'сreation_date',
    key: 'сreation_date'
  }
]

const getTagColor = (status) => {
  switch (status) {
    case 'Переговоры':
      return 'green'
    case 'Принимают решение':
      return 'orange'
    case 'Закрыто и не реализовано':
      return 'red'
    default:
      return 'blue'
  }
}

const onTableExpand = (expanded, record) => {
  expandedRowKeys.value = expanded ? [record.key] : []
}

onMounted(async () => {
  await fetchLeads()
})
</script>

<template>
  <div class="mt-10 relative w-4/5 m-auto rounded-lg py-5 bg-white px-8">
    <div class="mb-5 flex justify-between">
      <h1>Тестовое задание</h1>
      <a-space>
        <a-input-search
          v-model:value="value"
          placeholder="Найти..."
          class="w-[200px]"
          @search="fetchLeads"
        />
      </a-space>
    </div>
    <div class="relative w-full">
      <a-spin
        v-if="isLoading"
        class="absolute w-full h-full top-0 left-0 z-20 m-0 items-center flex justify-center"
      />
      <a-table
        :columns="columns"
        :data-source="leads"
        :pagination="false"
        :expandRowByClick="true"
        :expandedRowKeys="expandedRowKeys"
        @expand="onTableExpand"
      >
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.key === 'budget'">
            <span>{{ record.budget.toLocaleString('fr-FR') }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getTagColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'responsible'">
            <div class="flex items-center gap-4">
              <img src="/avatar.png" alt="avatar" />
              <span>{{ record.responsible }}</span>
            </div>
          </template>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>

        <template v-slot:expandedRowRender="{ record }">
          <div class="flex gap-5 items-center">
            <div class="flex gap-3 items-center">
              <img src="/avatar.png" alt="avatar" />
              <span>{{ record.contact.name }}</span>
            </div>
            <a v-if="record.contact.phone" :href="`tel:${record.contact.phone}`"
              ><img src="/phone.png" alt="phone"
            /></a>
            <a v-if="record.contact.email" :href="`mailto:${record.contact.email}`"
              ><img src="/email.png" alt="email"
            /></a>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped></style>

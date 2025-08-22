<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Choisissez votre rôle</h2>
      <div class="flex flex-col gap-3">
        <button
          v-for="role in roles"
          :key="role"
          @click="$emit('select', role)"
          class="btn-primary"
        >
          {{ role === 'agent' ? 'Agent de structure' : (role === 'tuteur' ? 'Tuteur' : role) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoleSelector',
  props: {
    roles: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select']
}
</script> 
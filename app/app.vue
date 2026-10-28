<template>
  <main class="container">
    <NuxtPage />
  </main>
</template>

<style>
/* Basit global stiller — ekstra UI kütüphanesi yok */
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #f4f5f7;
  color: #1f2328;
}
.container { max-width: 720px; margin: 0 auto; padding: 32px 16px; }
h1 { margin: 0; font-size: 28px; }
input, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  font: inherit;
  background: #fff;
}
textarea { min-height: 90px; resize: vertical; }
input:focus, textarea:focus { outline: 2px solid #4f46e5; border-color: transparent; }
button {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  font: inherit;
  cursor: pointer;
}
button:hover { background: #4338ca; }
button:disabled { opacity: 0.6; cursor: default; }
button.secondary { background: #e5e7eb; color: #1f2328; }
button.secondary:hover { background: #d1d5db; }
button.danger { background: #dc2626; }
button.danger:hover { background: #b91c1c; }
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.error { color: #dc2626; margin: 8px 0 0; }
.muted { color: #6b7280; font-size: 13px; }
</style>

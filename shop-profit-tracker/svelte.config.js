import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter() // outputs to '.svelte-kit/output', NOT 'build'
  }
};
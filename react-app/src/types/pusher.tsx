// global.d.ts hoặc ở đầu file .ts/.tsx
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export {};

declare global {
  interface Window {
    Echo: Echo<any>;
    Pusher: typeof Pusher;
  }
}

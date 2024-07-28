/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to use Colyseus Arena
 *
 * If you're self-hosting (without Arena), you can manually instantiate a
 * Colyseus Server as documented here: 👉 https://docs.colyseus.io/server/api/#constructor-options
 */
import { listen } from '@colyseus/arena'

// Import arena config
import arenaConfig from './arena.config'
import { logger } from './logger';

// Create and listen on 2567 (or PORT environment variable.)
listen(arenaConfig).then(() => {
    console.clear();
    logger.info("Listening on ws://localhost:2567")
})
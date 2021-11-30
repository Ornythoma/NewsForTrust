import { SHUTDOWN_SIGNALS } from '@server/helpers/constants';
import { RegisterProcessShutdownListener, Shutdown, FORCE_EXIT_FUNCTION } from '@server/helpers/functions';
import { InitializeCLI } from '@server/controllers/cli';

async function Initialize(): Promise<void> {
    try {
        console.log('NEWS FOR TRUST (NFT)');
        console.log('********************');
        RegisterShutdownEvents();
        RegisterShutdownListeners();
        await InitializeCLI();
    } catch(error) {
        console.error('AN ERROR OCCURRED DURING INITIALIZATION');
		console.error(error);
		return await Shutdown();
    }
}

function RegisterShutdownEvents(): void {
    console.log('Registering shutdown events...');

    SHUTDOWN_SIGNALS.forEach((signal: NodeJS.Signals) => {
        process.on(signal, FORCE_EXIT_FUNCTION());
        process.on(signal, Shutdown);
    });

    process.on('beforeExit', FORCE_EXIT_FUNCTION());
    process.on('beforeExit', Shutdown);

    console.log('Shutdown events registered successfully');
}

function RegisterShutdownListeners(): void {
    console.log('Registering shutdown listeners...');
    // Add shutdown listeners here
    console.log('Shutdown listeners registered successfully');
}

Initialize();
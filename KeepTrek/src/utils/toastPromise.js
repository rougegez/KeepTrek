import { toast } from 'sonner';

async function toastPromise(promise, options = {}) {
    const {
        loading = 'Loading...',
        success = 'Success!',
        error = 'Error occurred',
        ...rest
    } = options;

    toast.promise(
        promise,
        {
            loading,
            success,
            error,
            ...rest,
        }
    );
    
    return await promise
}

export default toastPromise;
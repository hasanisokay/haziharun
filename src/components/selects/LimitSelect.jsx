'use client'
import Select from 'react-select';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const LimitSelect = ({ limit }) => {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false)
    const [selectedLimit, setSelectedLimit] = useState({ value: limit, label: `${limit} items per page` });

    const limitOptions = [
        { value: 10, label: '10 items per page' },
        { value: 50, label: '50 items per page' },
        { value: 100, label: '100 items per page' },
        { value: 200, label: '200 items per page' },
        { value: 500, label: '500 items per page' },
    ];

    useEffect(() => {
        if (hasMounted) {
            const query = new URLSearchParams(window.location.search);
            query.set('limit', selectedLimit.value);
            query.set("page", 1)
            router.replace(`${window.location.pathname}?${query.toString()}`, { scroll: false });

        } else { setHasMounted(true) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLimit]);

    return (
        <div className='flex mb-4 text-black gap-2'>
            <Select
                defaultValue={selectedLimit}
                options={limitOptions}
                onChange={setSelectedLimit}
                className='select-react'
                instanceId={'limit-select'}
            />
        </div>
    );
};

export default LimitSelect;
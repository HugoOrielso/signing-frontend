"use client";
import { useSessionStore } from '@/store/adminSession';
import ContractsTable from './ContracTable';
import ContractsTableWithParams from './ContractTableWithParams';

const DeterminateTable = () => {
    const user = useSessionStore((s) => s.user);
    return (
        <div>
            {user?.role === "CREDIT_ANALYST" ? <ContractsTableWithParams /> : <ContractsTable />}
        </div>
    )
}

export default DeterminateTable
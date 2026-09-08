'use client';

import { API, APIRoute } from '@/config/axios';
import { endPoints } from '@/constants/endpoints';
import { useProfile } from '@/context/ProfileContext';
import { getRoutePath } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function DashboardPage() {
  const profile = useProfile();
  const { refetch, data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => APIRoute.get(getRoutePath(endPoints.me)),
  });
  return (
    <>
      <h1>Dashboard- {profile?.name}</h1>
      <button onClick={() => refetch()}>refetch</button>

      {isLoading ? 'loading' : JSON.stringify(data, null, 2)}
    </>
  );
}

import { API, APIRoute } from '@/config/axios';
import { endPoints } from '@/constants/endpoints';
import { Profile } from '@/features/profile/profile.types';
import { getRoutePath } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { ReactNode, useContext } from 'react';

export const profileContext = React.createContext<null | Profile>(null);
type ProfileProviderProps = {
  children: ReactNode;
};
export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  // const { data, error } = useQuery({
  //   queryKey: ['profile'],
  //   queryFn: () => APIRoute.get<Profile>(getRoutePath(endPoints.profile)),
  // });
  // console.log(error);
  return (
    <profileContext.Provider value={null}>{children}</profileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(profileContext);
};

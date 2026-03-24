import {createContext, useContext} from "react";
import HttpService from "../services/http";
import StorageService from "../services/storage";
import UrlsService  from '../services/urls';

const ServicesContext = createContext();

const useServices = () => useContext(ServicesContext);

const ServicesProvider = ({children, baseUrl}) => {
    const storageService = new StorageService();
    const urlsService = new UrlsService(baseUrl);
    // STEP 12: Pass the refresh token URL so HttpService can refresh expired access tokens automatically
    const httpService = new HttpService(storageService, urlsService.getRefreshTokenUrl());

    const value = {
        httpService,
        storageService,
        urlsService,
    };

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
}

export default ServicesProvider;

export {
    useServices,
};
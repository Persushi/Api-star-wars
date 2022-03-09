import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from 'axios'

const BASE_URL = 'https://swapi.dev/api'
@Injectable()
export class swService {
    url: string
    apiClient: AxiosInstance
    constructor(
    ) {
        this.url = `${BASE_URL}`
        this.initApiClient()
        //posibilidad de agregar las conexiones a /starships, /films, /species
    }

    private initApiClient() {
        this.apiClient = axios.create({
            headers: {
                Accept: 'application/json',
                'Accept-Charset': 'utf-8',
                'Accept-Encoding': 'deflate, gzip'
            },
            responseType: 'json',
            baseURL: this.url
        });
    }
    //relacionado a /People
    async getPeople(page = 1) {
        const data = await this.apiClient.get(`/people/?page=${page}`)
        let results = [...data.data.results]
        if (data.data.next) {
            const next = await this.getPeople(page + 1)
            results = [...results, ...next]
        }
        return results
    }
    async getPeopleById(id: number) {
        const data = await this.apiClient.get(`/people/${id}`)
        return data.data
    }
    async getPeopleByName(name: string) {
        const data = (await this.getPeople()).filter(element => {
            if (element.name.includes(name)) return element
        })
        return data
    }

    // relacionado a /Planets
    async getPlanets(page = 1) {
        const data = await this.apiClient.get(`/planets/?page=${page}`)
        let results = [...data.data.results]
        if (data.data.next) {
            const next = await this.getPlanets(page + 1)
            results = [...results, ...next]
        }
        return results
    }
    async getCountByClimate() {
        const data = await this.getPlanets()
        const results = {}
        // aca la poblacion se divide por la cantidad de climas que existen en un planeta
        // ejemplo: si hay 300 habitantes en un planeta que tiene como clima templado y humedo
        // se estima que habra 150 en cada clima, ya que agregar 300 a ambos no tendria mucho sentido
        // en caso de que un clima unico coincida con un unico planeta que su poblacion tambien es "unkown" este no va aparecer
        data.forEach((element) => {
            element.population = parseInt(element.population)
            if (element.population > -1) {
                if (element.climate.includes(',')) {
                    const climas = element.climate.split(',')
                    for (let i = 0; i < climas.length; i++) {
                        console.log(climas[i])
                        results[climas[i].trim()] ? results[climas[i].trim()] += Math.floor(element.population / climas.length)
                            : results[climas[i].trim()] = Math.floor(element.population / climas.length)
                    }
                } else {
                    results[element.climate.trim()] ? results[element.climate.trim()] += element.population
                        : results[element.climate.trim()] = element.population
                }
            }
        }
        )
        return results
    }
    async getVehicles(page = 1) {
        const data = await this.apiClient.get(`/vehicles/?page=${page}`)
        let results = [...data.data.results]
        if (data.data.next) {
            const next = await this.getVehicles(page + 1)
            results = [...results, ...next]
        }
        return results
    }
    async getVehiclesByPrice() {
        const data = await this.getVehicles()
        const newData = data.filter(value => {
            if (value.cost_in_credits != 'unknown') return value
        })
        return newData.sort((a, b) => {
            a.cost_in_credits = parseInt(a.cost_in_credits)
            b.cost_in_credits = parseInt(b.cost_in_credits)
            if (a === b)
                return 0;

            return a.cost_in_credits < b.cost_in_credits ? 1 : -1;
        }).slice(0, 10)
    }
    async getVehiclesPilot(pilot: string) {
        const pilots = await this.getPeopleByName(pilot)
        const vehicles = (await this.getVehicles()).filter(value => {
            for (let i = 0; i < pilots.length; i++) {
                if (value.pilots.includes(pilots[i].url)) {
                    return value
                }
            }
        })
        return vehicles
    }
}

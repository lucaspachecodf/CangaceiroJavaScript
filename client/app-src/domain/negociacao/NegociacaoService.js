import { HttpService } from '../../util/HttpService.js';
import { Negociacao } from './Negociacao.js';
import { ApplicationException } from '../../util/ApplicationException.js';

export class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {

        return this._http.get('negociacoes/semana').then(dados => {
            const negociacoes = dados.map(objeto =>
                new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

            return negociacoes;

        }, err => {
            throw new ApplicationException('Não foi possível obter as negociações');
        })
    };

    obterNegociacoesDaSemanaAnterior() {
        return this._http.get('negociacoes/anterior').then(dados => {
            const negociacoes = dados.map(objeto =>
                new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

            return negociacoes;
        },
            err => {
                throw new ApplicationException('Não foi possível obter as negociações da semana anterior');
            }
        );
    }

    obterNegociacoesDaSemanaRetrasada() {
        return this._http.get('negociacoes/retrasada').then(dados => {
            const negociacoes = dados.map(objeto =>
                new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

            return negociacoes;
        },
            err => {
                throw new ApplicationException('Não foi possível obter as negociações da semana retrasada');
            }
        );
    }

    async obterNegociacoesDoPeriodo() {
        try {
            let periodo = await Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ])
            return periodo.reduce((novoArray, item) => novoArray.concat(item), [])
                .sort((a, b) => b.data.getTime() - a.data.getTime());
        }
        catch (err) {
            console.log(err);
            throw new Error('Não foi possível obter as negociações do período')
        }
    }
}

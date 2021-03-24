class NegociacaoController {

    constructor() {
        const $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._negociacoes = new Bind(
            new Negociacoes(),
            new NegociacoesView('#negociacoes'),
            'adiciona', 'esvazia'
        );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView('#mensagemView'),
            'texto'
        );

        this._service = new NegociacaoService();
    }

    adiciona(event) {
        try {
            event.preventDefault();
            this._negociacoes.adiciona(this._criarNegociacao());
            this._mensagem.texto = 'Negociação adicionada com sucesso';
            this._limparFormalario();
        }
        catch (error) {
            this._mensagem.texto = error.message;

            if (error instanceof DataInvalidaException) {
                this._mensagem.texto = error.message;
            } else {
                //	mensagem genérica para qualquer problema que possa acontecer
                this._mensagem.texto = 'Um erro	não	esperado aconteceu. Entre em contato com o suporte';
            }

        }
    }

    _limparFormalario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

    _criarNegociacao() {
        return new Negociacao(
            DateConverter.paraData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value))
    }

    apaga() {
        this._negociacoes.esvazia();
        this._mensagem.texto = 'Negociações	apagadas com sucesso';
    }

    importaNegociacoes() {

        this._service.obterNegociacoesDoPeriodo().then(negociacoes => {
            negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações importadas com sucesso';

        }).catch(err => this._mensagem.texto = err);
    }
}
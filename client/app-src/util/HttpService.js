export class HttpService {

    _handleErrors(res) {
        // se não estiver ok, lança a exceção
        if (!res.ok) throw new Error(res.statusText);
        return res;
    }

    get(url) {
        return fetch(url)
            .then(res => this._handleErrors(res))
            .then(res => res.json());
    }
}
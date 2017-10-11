import axios from 'axios'

const URL = 'http://localhost:3003/api/todos'

export const changeDescription = event => ({
    type: 'DESCRIPTION_CHANGED',
    payload: event.target.value
})

export const search = () =>{
    return (dispatch, getState) =>{
        //Pega o stado da description, NÃO FAZER SEMPRE, só evitando passar description pra todos os métodos
        const description = getState().todo.description
        const search = description ? `&description__regex=/${description}/` : ''
        const request = axios.get(`${URL}?sort=-createdAt${search}`)
            .then(resp => dispatch({ type: 'TODO_SEARCH', payload: resp.data }))
    }
}

export const add = (description) =>{
    return dispatch =>{
        axios.post(URL, { description })
            .then(resp => dispatch(clear()))//Adiciona a descricao E APAGA O CAMPO
            .then(resp => dispatch(search())) // depois chama o search, só vai chamar o search depois do post
    }
}

export const markAsDone = (todo) =>{
    return dispatch =>{
        axios.put(`${URL}/${todo._id}`, {...todo, done: true})
            .then(resp => dispatch(search()))
    }
}

export const markAsPending = (todo) =>{
    return dispatch =>{
        axios.put(`${URL}/${todo._id}`, {...todo, done: false})
            .then(resp => dispatch(search()))
    }
}


export const removeTodo = (todo) =>{
    return dispatch =>{
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => dispatch(search()))
    }
}

export const clear = () =>{
    return [{ type: 'TODO_CLEAR'}, search()]
}
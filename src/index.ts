import {fromEvent, Observable, of} from 'rxjs'
import {ajax} from "rxjs/ajax";
import {switchMap, mergeMap, tap, catchError, map} from "rxjs/operators";
import axios from 'axios';

const button = document.getElementById('button');
const wrapperUser = document.getElementById('wrapperUser');
const wrapperPost = document.getElementById('wrapperPost');

interface User {
    id: string,
    name: string,
    email: string,
    address: object
}

interface Post {
    userId: number,
    id: number,
    title: string,
    body: string
}

interface Comment {
    postId: number,
    id: number,
    name: string,
    email: string,
    body: string
}

interface Response {
    data: Array<object>
}

const steamUser$ = fromEvent(button, 'click')
    .pipe(
        tap(() => wrapperUser.innerHTML = ''),
        switchMap((value: object) => Observable.create((observer: any) => {
                axios.get('https://jsonplaceholder.typicode.com/users')
                    .then((response: Response) => {
                        response.data.map((user: User) => {
                            observer.next(user);
                        });
                    })
                    .catch((error: string) => {
                        let html = ` <div class="error">${error}</div>`;
                        wrapperUser.insertAdjacentHTML("beforeend", html)
                    });
            })
        )
    );

steamUser$.subscribe(
    (user: User) => {
        const divUser = wrapperUser.appendChild(document.createElement('div'));
        divUser.id = user.id;
        divUser.className = 'buttonUser';
        divUser.innerHTML = user.name;

        console.log(divUser)
    },
    (error: string) => console.log('Error:' + error),
    () => console.log('Completed')
);

























// const steamUser$ = fromEvent(button, 'click')
//     .pipe(
//         tap(()  => wrapperUser.innerHTML = ''),
//        switchMap((value: object) =>  ajax.getJSON('https://jsonplaceholder.typicode.com/users').pipe(
//             catchError(error => {
//                 console.log('errorAjax: ', error.message);
//                 return of (error);
//             })
//         )),
//         mergeMap((items: any) => items)
//     );
// steamUser$.subscribe((user: User) => {
//         const html = ` <div class="user" style="border: 1px solid beige; padding: 10px;">${user.name}</div>`;
//         wrapperUser.insertAdjacentHTML("beforeend", html)
//     },
//     (error:any) => console.log('Error:' + error),
//     () => console.log('Completed')
// );

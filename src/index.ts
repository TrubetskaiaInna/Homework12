import {fromEvent, Observable, of} from 'rxjs'
import {switchMap, mergeMap, tap, catchError, map} from "rxjs/operators";
import axios from 'axios';

const button = document.getElementById('button');
const message = document.getElementById('message');
const wrapperUser = document.getElementById('wrapperUser');
const wrapperPost = document.getElementById('wrapperPost');
const wrapperComment = document.getElementById('wrapperComment');

interface User {
    id: number,
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
        tap(() => {
            wrapperUser.innerHTML = '';
            wrapperPost.innerHTML = '';
            wrapperComment.innerHTML = ''
        }),
        switchMap((value: object) =>
            Observable.create((observer: any) => {
                axios.get('https://jsonplaceholder.typicode.com/users')
                    .then((response: Response) => {
                        // message.style.display = 'flex';
                        response.data.map((user: User) => {
                            observer.next(user);
                        });
                    }).catch((error: string) => {
                        let html = ` <div class="error">${error}</div>`;
                        wrapperUser.insertAdjacentHTML("beforeend", html)
                    });
            })
        )
    );

steamUser$.subscribe(
    (user: User) => {
        const divUser = wrapperUser.appendChild(document.createElement('div'));
        divUser.className = 'buttonUser';
        divUser.innerHTML = user.name;

        const steamPost$ = fromEvent(divUser, 'click')
            .pipe(
                tap(() => {
                    wrapperPost.innerHTML = '';
                    wrapperComment.innerHTML = ''
                }),
                switchMap((value: Object) =>
                    Observable.create((observer: any) => {
                        axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
                            .then((response:Response)=>{
                                response.data.map((post: Post) => {
                                    observer.next(post);
                                });
                            }).catch((error: string) => {
                                let html = ` <div class="error">${error}</div>`;
                                wrapperUser.insertAdjacentHTML("beforeend", html)
                            })
                    })
                )
            );
        steamPost$.subscribe(
            (post: Post) => {
                const divPost = wrapperPost.appendChild(document.createElement('div'));
                divPost.className = 'buttonPost';
                divPost.innerHTML = post.title;

                        const steamComment$ = fromEvent(divPost, 'click');
                        steamComment$.subscribe(() => {
                            axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                                .then((response: Response) => {
                                    wrapperComment.innerHTML = '';
                                    response.data.map((comment: Comment) => {
                                        const divComment = wrapperComment.appendChild(document.createElement('div'));
                                        divComment.className = 'comment';
                                        divComment.innerHTML = comment.name;
                                    })
                                }).catch((error: string) => {
                                let html = ` <div class="error">${error}</div>`;
                                wrapperUser.insertAdjacentHTML("beforeend", html)
                            })
                        })
                    });
    },
    (error: string) => console.log('Error:' + error),
    () => console.log('Completed')
);





















//------------spinner--------------
// const spinner = divPost.appendChild(document.createElement('div'));
// spinner.className = 'spinner-border spinner-border-sm';
// spinner.setAttribute('role', 'status');
// const spinnerSpan = spinner.appendChild(document.createElement('span'));
// spinnerSpan.className = 'sr-only'




import { fromEvent, Observable } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'
import axios from 'axios'

const button = document.getElementById('button')
const message = document.getElementById('message')
const wrapperUser = document.getElementById('wrapperUser')
const wrapperPost = document.getElementById('wrapperPost')
const wrapperComment = document.getElementById('wrapperComment')

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string
        }
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string
    }
}

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

interface Response<T> {
    data: T;
}

const steamUser$ = fromEvent(button, 'click')
  .pipe(
    tap(() => {
      wrapperUser.innerHTML = ''
      wrapperPost.innerHTML = ''
      wrapperComment.innerHTML = ''
    }),
    switchMap(() =>
      Observable.create((observer: any) => {
        axios.get('https://jsonplaceholder.typicode.com/users')
          .then((response: Response<Array<User>>) => {
            message.style.display = 'flex'
            setTimeout(() => { message.style.display = 'none' }, 2000)
            response.data.map((user: User) => {
              observer.next(user)
            })
          }).catch((error: string) => {
            const html = ` <div class="error">${error}</div>`
            wrapperUser.insertAdjacentHTML('beforeend', html)
          })
      })
    )
  )

steamUser$.subscribe(
  (user: User) => {
    const divUser = wrapperUser.appendChild(document.createElement('div'))
    divUser.className = 'buttonUser'
    divUser.innerHTML = user.name

    const steamPost$ = fromEvent(divUser, 'click')
      .pipe(
        tap(() => {
          wrapperPost.innerHTML = ''
          wrapperComment.innerHTML = ''
        }),
        switchMap(() =>
          Observable.create((observer: any) => {
            axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
              .then((response: Response<Array<Post>>) => {
                message.style.display = 'flex'
                setTimeout(() => { message.style.display = 'none' }, 2000)
                response.data.map((post: Post) => {
                  observer.next(post)
                })
              }).catch((error: string) => {
                const html = ` <div class="error">${error}</div>`
                wrapperUser.insertAdjacentHTML('beforeend', html)
              })
          })
        )
      )
    steamPost$.subscribe(
      (post: Post) => {
        const divPost = wrapperPost.appendChild(document.createElement('div'))
        divPost.className = 'buttonPost'
        divPost.innerHTML = post.title

        const spinner = divPost.appendChild(document.createElement('div'))
        spinner.className = 'spinner-border spinner-border-sm'
        spinner.setAttribute('role', 'status')
        const spinnerSpan = spinner.appendChild(document.createElement('span'))
        spinnerSpan.className = 'sr-only'

        axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
          .then((response: Response<Array<Comment>>) => {
            spinner.style.display = 'none'
            const elementNumber = divPost.appendChild(document.createElement('div'))
            elementNumber.innerHTML = String(response.data.length)
            elementNumber.className = 'number'
          })

        const steamComment$ = fromEvent(divPost, 'click')
        steamComment$.subscribe(() => {
          axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
            .then((response: Response<Array<Comment>>) => {
              wrapperComment.innerHTML = ''
              response.data.map((comment: Comment) => {
                message.style.display = 'flex'
                setTimeout(() => { message.style.display = 'none' }, 2000)
                const divComment = wrapperComment.appendChild(document.createElement('div'))
                divComment.className = 'comment'
                divComment.innerHTML = comment.name
              })
            }).catch((error: string) => {
              const html = ` <div class="error">${error}</div>`
              wrapperUser.insertAdjacentHTML('beforeend', html)
            })
        })
      })
  },
  (error: string) => console.log('Error:' + error),
  () => console.log('Completed')
)

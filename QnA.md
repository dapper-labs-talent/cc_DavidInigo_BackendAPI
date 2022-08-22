How long did this assignment take?
> It took me 3 hours and 30 minutes to implement the code, and 30 minutes to prettify it and to
> add documentation comments

What was the hardest part?
> I think the hardest part of this exercise is to conceptually understand what a JWT token is,
> and how it can be used securely for authentication in other strategies like OAuth2 and OIDC. 
> The most time-consuming part was setting up validation of requests parameters with node-express
> and to understand how the Passport library works.
> It was also hard to implement the update users query statement by concatenating strings, as I didn't 
> use any ORM that could have made it easier.

Did you learn anything new?
> I learnt how the Passport and express-validator libraries work. I also brushed up on my knowledge of
> JWT tokens and the Bcrypt algorithm (and why not to use MD5 or SHA on authentication)

Is there anything you would have liked to implement but didn't have the time to?
> I would have liked to implement the passport JWT middleware strategy on my own. I feel like it works
> too much like "magic" and it would have been more clear what it does if I implemented it instead.
> (extract the token from the header, verify it was signed with a valid secret, and place the token
> payload in the request, so it can be accessed by the handlers)
> If I had the time, I also would have liked to implement a cache, maybe using Redis, in order to 
> have all the user data without having to query the DB (it is not a good idea to save all the user
> data in a JWT token, as they are not encrypted and the size shouldn't grow too big as they are given
> on every request). 
> A cache would also allow to immediately remove access to the system for a user.
> In this case, since the update user function didn't need anything else than the user ID,
> and since there was no endpoint to remove a user, there was no need for it.

What are the security holes (if any) in your system? If there are any, how would you fix them?
> This implementation is fairly safe, but it does have some holes.
> It is safe against SQL injections - values are injected using the battle-tested pg library instead of interpolating 
> strings.
> It is also safe against brute-force and rainbow table attacks, as it uses a cost factor of 10 for
> the Bcrypt algorithm, limiting the system to generate around [10 hashes per second](https://www.npmjs.com/package/bcrypt)
> What is not safe is that there is no way to immediately revoke access to a user. Any user
> will have access until the JWT token is expired, and there is no way to prevent it in the current
> implementation.
> Also, since this is an API for a frontend application, it should have more security added to it like
> CORS and also an anti-CSRF token to prevent Cross Site Request Forgery attacks

Do you feel that your skills were well tested?
> I feel that some of my understanding on authentication and authorization was tested on this exercise,
> as well as my ability to implement REST APIs and interact with a SQL database.
> It could have gone deeper into more complex protocols like OAuth2 and OIDC, but it would have been
> more than a 4 hours exercise.
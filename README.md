<p align="center"><a target="_blank" href=""><img src="/public/imgs/logo.png" height="40"></img></a></p>
<h1 align="center"><a target="_blank" href="">VISIT HERE</a></h1>

<a target="_blank" href="">
  <img src="/public/imgs/lablim-online-demo.gif" alt="LabLIM Online Gif">
</a>

<br/>
<br/>

<p>Get all the testing that your business needs at <a target="_blank" href="https://lablim-online.com/">Lablim Online</a>! Explore a platform where you can offer and receive testing services for products. Connect with others who need your expertise and find opportunities to contribute your skills. Join now to become part of a dynamic network focused on product testing and innovation.</p>

## How It's Made:

**Featured Tech:** 
<div>
  <picture><img src="https://img.shields.io/static/v1?label=&message=React&color=285700&style=plastic&logo=react&labelColor=333333" alt="React"/></picture>
  <picture><img src="https://img.shields.io/static/v1?label=&message=JS&color=285700&style=plastic&logo=javascript&labelColor=333333" alt="JavaScript"/></picture>
  <picture><img src="https://img.shields.io/static/v1?label=&message=MUI&color=285700&style=plastic&logo=mui&labelColor=333333" alt="MUI"/></picture>
  <picture><img src="https://img.shields.io/static/v1?label=&message=Supabase&color=285700&style=plastic&logo=supabase&labelColor=333333" alt="Supabase"/></picture>
  <picture><img src="https://img.shields.io/static/v1?label=&message=Node.js&color=285700&style=plastic&logo=nodedotjs&labelColor=333333" alt="NodeJS"/></picture>
  <picture><img src="https://img.shields.io/static/v1?label=&message=React Router&color=285700&style=plastic&logo=reactrouter&labelColor=333333" alt="React Router"/></picture>
  <picture><img src="https://img.shields.io/static/v1?label=&message=PostgreSQL&color=285700&style=plastic&logo=postgresql&labelColor=333333" alt="PostgreSQL"/></picture>
</div>

<p>A generalized wireframe illustrating the application flow is shown below.</p>

<picture><img src="/public/imgs/lablim-online-wireframe.png" alt="LabLIM Online Wireframe"/></picture>

## For Demo Use:

Demo Email: <span>guest@</span><span>lablimonline.com</span>

Demo Password: lablimonline

## Next Version
In the upcoming v1.1, more features will be added to improve accessibility and communication. This new version would bring the addition of:
- Autocomplete integration while both searching for vendors and filtering orders.
- Having vendors create preset tests and services that the client can see the rates for.
- Migrate all DB connections to be server-sided (security).

## Next features to implement:
- Cross-comparing rates to get the client the best deal.
- Addition of a delivery tracking system so both the client and vendor know where packages containing samples are at all times.
- Ability to download results in bulk (multi-order export).
- Adding in-app communications between clients and vendors for more communication and assistance.
  
## Lessons Learned:

<p>Overall, my experience with MUI has been delightful and I intend to keep using it for future projects. Of all the other framework libraries for styling it's been the best one for me since it allows me to focus on the logic of an app rather than its style.</p> 

<p>It was particularly critical for its use of tables but I tried using it whenever applicable building the views. While it's not as easy to use as Bootstrap, it's less tedious than TailwindCSS and was a good choice that led me to the best result.</p>

<p>When creating an order that has samples with each having tests at once, it was imperative to keep all the information stored in separate tables but still linked. Making the connection between the client and the database had some challenges.</p>

<p>One memorable bug I faced was a persistent mismatch in ID values for newly made orders which disrupted this process. I eventually learned that the ID was being recalculated so I used the react hook useMemo to prevent that.</p>

<p>I also had to deal with some of the shortcomings of Supabasse when handling this since I wanted more user information but couldn't get it all at once when a user signed up. SQL techniques like creating view tables to then reference allowed me to work around that.</p>

<p>Due to this there were two types of protected routes, one for users who didn't register and another for users who still had missing information. It adds a bit more complexity but it holds well.</p>

<p>With the high amount of tables that had to interact at once in the DB, there was a lot of room for error when making requests. Formatting data before and after it gets sent so that it's usable was a task I became increasingly proficient in.</p>

<script lang="ts">
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<h3>library</h3>

<table>
  <tr>
    <th>document</th>
    <th>author</th>
    <th>year</th>
    <th>link</th>
  </tr>

  {#each data.docs as doc}
    <td>{doc.title}</td>
    <td>{doc.author}</td>
    <td>n/a</td>
    <td><a href={doc.url} target="_blank" rel="noopener noreferrer">PDF</a></td>
  {/each}
</table>

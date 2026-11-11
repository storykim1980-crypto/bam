import{spawnSync}from'node:child_process';
const repo=process.env.GITHUB_REPOSITORY?.split('/')[1]||'bam';
const owner=process.env.GITHUB_REPOSITORY_OWNER||'storykim1980-crypto';
const env={...process.env,STATIC_BUILD:'1',BASE_PATH:process.env.BASE_PATH??(repo===owner+'.github.io'?'':'/'+repo),SITE_HOST:process.env.SITE_HOST||owner+'.github.io'};
console.log('Pages target:',env.SITE_HOST+env.BASE_PATH+'/');
const result=spawnSync(process.execPath,['tools/site-export.mjs'],{env,stdio:'inherit'});process.exit(result.status??1);

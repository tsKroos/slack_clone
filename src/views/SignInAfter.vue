<template>
    <div class="flex flex-col h-screen">
        <header class="flex justify-between p-4 border-b items-center">
        <h1 class="font-semibold text-xl leading-tight">Slack Clone</h1>
        <button class="py-1 px-3 border-2 border-green-800 rounded">
            <router-link to="/signin">サインイン</router-link>
        </button>
        </header>
            <div class="bg-gray-100 flex-auto">
                <div class="flex justify-center mt-16">
                    <div class="w-2/5 border bg-white">
                        <div class="my-12 text-center">
                            <h2 class="text-4xl font-bold">ユーザー登録が完了しました</h2>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>